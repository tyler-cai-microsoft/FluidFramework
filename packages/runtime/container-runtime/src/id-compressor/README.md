# **Distributed ID Allocator**

A library which generates small number representations of arbitrary non-colliding Version 4 UUIDs ("stable IDs") across multiple sessions in a network. This scheme enables a distributed application to utilize the global uniqueness guarantees of UUIDs while maintaining the performance advantages of small integers.

## **Overview**

The distributed ID allocation scheme allows clients to use, store, and reference small numbers that map to UUIDs rather than the UUIDs themselves. The primary benefits are improved memory efficiency and reduced storage size, as well as improved runtime performance when used as keys in collections.

The scheme requires a total order for ID allocation, so the allocator is designed to work within a service that provides centralized total order broadcast.

## **Sessions**

A session can be thought of as a unique identifier for a single allocator. Even if an allocator is taken offline, serialized to disk, and rehydrated back, it's considered the same session if it has the same session ID.

## **Document**

The set of IDs generated by all Sessions contributing to the same distributed collection (e.g. an individual collaborative document). Uniqueness of allocated IDs is limited to the document context (unless in their UUID form), and thus IDs in their compressed form are not portable between documents.

## **Generation API**

New IDs are generated via a synchronous API on the allocator. The API returns a small number representation of the UUID with the following guarantees:

-   The ID can be synchronously converted into a full UUID at any time. This is required if global uniqueness (across documents) is needed.
-   Prior to the service being notified of the ID's creation, it is unique within the scope of the session (i.e. the new ID will not collide with other IDs from the same allocator, but it can collide with IDs from a different allocator in the same network).
-   After the service has been notified of the ID's creation and has determined a total ordering between all clients creating IDs, the ID will have a "final" form that is a small number representation that is unique across the [document](#document).

## **ID Spaces**

The allocation scheme separates the small-number IDs into two "spaces":

1. Session space: IDs are unique within the session scope, but are not guaranteed to be [document](#document) unique without the accompanying context of their session ID.
2. Op space: IDs are in their most final form, as unique as possible within the entire system. IDs that have been ordered by the central service ("finalized") are represented in their final form, while any other IDs that have not yet been finalized are left in their "session space" form.

Each of these spaces is represented by a discrete type. This allows for the direct encoding of an ID's uniqueness guarantees without contextual ambiguity. An ID can be "normalized" from one space to the other with a sychronous call.

## **Usage Guidelines**

When delivering Allocated IDs to application authors for use in place of V4 UUIDs, follow these guidelines:

-   Expose only session space IDs to application authors. This means that application developers don't need to manage multiple ID spaces or worry about converting IDs between session space and op space. This simplifies the data management process and reduces the chances of errors or inconsistencies.

    -   **Note:** Session space IDs are only unique within the originating session (for most applications this will mean within each individual client's app instance, as it is rare to hold handles to more than one allocator). This constrains usage to scopes where IDs are unique; for instance, application developers should never persist these IDs and should instead be directed to convert them to stable IDs first.

-   Use op space IDs for serialized forms, such as sending information over the wire or storing it in a file. Op space IDs are always generated in their _final_ form when possible, which imparts a performance benefit by reducing normalization work when a client receives a network operation or rehydrates an allocator.
-   When serializing op space IDs, annotate the entire context (e.g., file or network operation) with the session ID. This is necessary because not all IDs in op space are in their final form. Any non-finalized IDs will still be in their session space form, unique only within that specific session. Annotating the entire context with the session ID ensures that recipients of the serialized data can correctly interpret and process the non-finalized IDs.

## **Efficiency Properties**

### **UUID Generation**

The allocator generates UUIDs in non-random ways to reduce entropy, optimizing storage of data. A session begins with a random UUID, and subsequent IDs are allocated sequentially. UUIDs generated with this strategy are less likely to collide than fully random UUIDs, and this fact can be leveraged to compact the on-disk and in-memory representations of the allocator.

UUID generation is O(1).

### **Decompression/recompression**

Converting an allocated ID into its UUID form (decompression) and the reverse (recompression) are both O(log<sub>n</sub>) in the number of IDs created by the originating session.

### **Clustering**

The sequential allocation approach allows the system to implement a clustering scheme.

As allocators across the network create IDs, they reserve blocks of positive ID space (clusters) for that allocator. The positive integer space is sharded across different clients, and session space IDs are mapped into these clusters.

Clusters are efficient to store, requiring only two integers: the base positive integer in the cluster and the count of reserved IDs in that cluster.

### **Normalization**

Normalization is O(log<sub>n</sub>) in the number of IDs created by the originating session, as it requires a simple binary search on the clusters owned by that session.