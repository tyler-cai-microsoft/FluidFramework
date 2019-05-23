import { FlowDocument } from "@chaincode/flow-document";
import { Scheduler, Template, View } from "@prague/flow-util";
import { PagePosition } from "../../../flow-editor/dist";
import { debug } from "../debug";
import { Page } from "../page";
import * as styles from "./index.css";

const template = new Template({
    tag: "div",
    props: { className: styles.viewport },
    children: [
        { tag: "div", props: { className: styles.document, tabIndex: 0 }, children: [
            { tag: "div", ref: "slot", props: { className: styles.slot }},
        ]},
    ],
});

interface IPageInfo {
    page: Page;
    root: HTMLElement;
}

interface IViewportInit {
    doc: FlowDocument;
    scheduler: Scheduler;
}

export class Viewport extends View<IViewportInit> {
    private state?: {
        doc: FlowDocument;
        scheduler: Scheduler;
        slot: HTMLElement;
        // tslint:disable-next-line:prefer-array-literal
        pages: IPageInfo[];
    };

    protected onAttach(props: Readonly<IViewportInit>) {
        const root = template.clone();
        const slot = template.get(root, "slot") as HTMLElement;
        const { doc, scheduler } = props;

        this.state = { doc, pages: [], scheduler, slot };
        this.addPage([doc.addLocalRef(0)]);

        return root;
    }

    protected onUpdate(): void {
        // do nothing
    }

    protected onDetach(): void {
        // do nothing
    }

    private addPage(pageStart: PagePosition) {
        const { doc, pages, scheduler, slot } = this.state;
        debug(`Inserted page #${pages.length}`);

        const pageRoot = document.createElement("div");
        slot.appendChild(pageRoot);

        const page = new Page();
        const nextIndex = pages.push({ page, root: pageRoot });

        page.attach(pageRoot, {
            doc,
            scheduler,
            pageStart,
            onPaginationStop: (position) => {
                this.noteNewStop(nextIndex, position);
            },
        });
    }

    private noteNewStop(pageIndex: number, newStart: PagePosition) {
        const { doc, pages } = this.state;

        const pos = doc.localRefToPosition(newStart[0]);

        this.state.scheduler.onIdle(() => {
            // If the new page stop is the end of the document, remove any following pages.
            if (pos === doc.length) {
                while (pages.length > pageIndex) {
                    const toDelete = pages.pop();
                    toDelete.root.remove();
                    toDelete.page.detach();
                    debug(`Removed page #${pages.length}`);
                }

                return;
            }

            const page = this.state.pages[pageIndex];
            if (page === undefined) {
                this.addPage(newStart);
            } else {
                page.page.update({ pageStart: newStart });
                debug(`Updated page #${pages.length}`);
            }
        });
    }
}
