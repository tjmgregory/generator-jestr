var Generator = require("yeoman-generator");
var path = require("path");

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option("dry-run", {
            description: "Perform a dry run and log the result.",
            type: Boolean,
            default: false,
        });
    }

    async prompting() {
        const { className, methodName } = await this.prompt([
            {
                type: "input",
                name: "className",
                message:
                    "What is the owning class name? (leave blank for an exported function)",
            },
            {
                type: "input",
                name: "methodName",
                message: "What is the method under test?",
            },
        ]);

        const isClassMethod = className.length > 0;

        const testTitles = await this._getTestTitle([]);

        this.inputArgs = {
            isClassMethod,
            className,
            methodName,
            testTitles,
        };
    }

    async _getTestTitle(prevTitles) {
        const { title } = await this.prompt([
            {
                type: "input",
                name: "title",
                message: `Describe a test case, "It..." (leave blank to finish)`,
            },
        ]);
        if (title.length > 0) {
            return this._getTestTitle([...prevTitles, title]);
        }
        return prevTitles;
    }

    async writing() {
        if (this.options["dry-run"]) {
            this.log(
                "Received the following inputs:",
                JSON.stringify(this.inputArgs, null, 2)
            );
            return;
        }

        // TODO: Configurable to be test or spec & js or ts
        const fileName = `${this.inputArgs.methodName}.test.js`;
        this.fs.copyTpl(
            this.templatePath("function.js"),
            path.join(this.contextRoot, fileName),
            this.inputArgs
        );
    }
};
