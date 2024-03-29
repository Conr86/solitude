import DecoratorPlugin from "./DecoratorPlugin";

export class Quotes extends DecoratorPlugin {
    public regex = /(?:["“][^"”]*["”])+|["“][^"”]*(?=$)/g;

    scan() {
        this.doc.descendants((node, position) => {
            if (!node.isText || !node.text) {
                return;
            }

            let matches: RegExpExecArray | null;
            while ((matches = this.regex.exec(node.text)) !== null) {
                const match = matches[0];
                const startIndex = matches.index;
                this.record(
                    position + startIndex,
                    position + startIndex + match.length,
                    "text-secondary-500 dark:text-primary-400 tracking-tight ",
                );
            }
        });

        return this;
    }
}
