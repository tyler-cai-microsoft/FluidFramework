import * as api from "@prague/container-definitions";
import * as git from "@prague/gitresources";

/**
 * Git cache data
 */
export interface IGitCache {
    // Reference mapping
    refs: { [key: string]: string };

    // All trees contained in the commit (includes submodules)
    trees: git.ITree[];

    // Commits for each module
    commits: git.ICommit[];
}

/**
 * Interface to a generic Git provider
 */
export interface IGitService {
    getBlob(sha: string): Promise<git.IBlob>;
    createBlob(blob: git.ICreateBlobParams): Promise<git.ICreateBlobResponse>;
    getContent(path: string, ref: string): Promise<any>;
    getCommits(sha: string, count: number): Promise<git.ICommitDetails[]>;
    getCommit(sha: string): Promise<git.ICommit>;
    createCommit(commit: git.ICreateCommitParams): Promise<git.ICommit>;
    getRefs(): Promise<git.IRef[]>;
    getRef(ref: string): Promise<git.IRef>;
    createRef(params: git.ICreateRefParams): Promise<git.IRef>;
    updateRef(ref: string, params: git.IPatchRefParams): Promise<git.IRef>;
    deleteRef(ref: string): Promise<void>;
    createTag(tag: git.ICreateTagParams): Promise<git.ITag>;
    getTag(tag: string): Promise<git.ITag>;
    createTree(tree: git.ICreateTreeParams): Promise<git.ITree>;
    getTree(sha: string, recursive: boolean): Promise<git.ITree>;
}

/**
 * The Historian extends the git service by providing access to document header information stored in
 * the repository
 */
export interface IHistorian extends IGitService {
    endpoint: string;

    /**
     * Retrieves the header for the given document
     */
    getHeader(sha: string): Promise<git.IHeader>;

}

export interface IGitManager {
    getHeader(id: string, sha: string): Promise<api.ISnapshotTree>;
    getCommit(sha: string): Promise<git.ICommit>;
    getCommits(sha: string, count: number): Promise<git.ICommitDetails[]>;
    getTree(root: string, recursive: boolean): Promise<git.ITree>;
    getBlob(sha: string): Promise<git.IBlob>;
    getRawUrl(sha: string): string;
    getContent(commit: string, path: string): Promise<git.IBlob>;
    createBlob(content: string, encoding: string): Promise<git.ICreateBlobResponse>;
    createTree(files: api.ITree): Promise<git.ITree>;
    createCommit(commit: git.ICreateCommitParams): Promise<git.ICommit>;
    getRef(ref: string): Promise<git.IRef>;
    createRef(branch: string, sha: string): Promise<git.IRef>;
    upsertRef(branch: string, commitSha: string): Promise<git.IRef>;
    write(branch: string, inputTree: api.ITree, parents: string[], message: string): Promise<git.ICommit>;
}
