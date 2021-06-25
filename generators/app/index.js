var Generator = require('yeoman-generator')
var path = require('path')
var prettier = require('gulp-prettier')

const DEFAULT_PRETTIER_CONFIG = {
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'es5',
}

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts)

        this.option('dry-run', {
            description: 'Perform a dry run and log the result.',
            type: Boolean,
            default: false,
        })

        this.config.defaults({ prettierConfigPath: '.prettierrc.js' })
    }

    async initializing() {
        await this._initializePrettierConfig()
    }

    async _initializePrettierConfig() {
        const prettierConfigPath = this.config.get('prettierConfigPath')
        if (
            prettierConfigPath.substring(prettierConfigPath.length - 2) !== 'js'
        ) {
            this.log(
                'Non .js/.cjs prettier configs not yet supported, using defaults.'
            )
            this.prettierConfig = DEFAULT_PRETTIER_CONFIG
            return
        }

        this.prettierConfig = require(this.destinationPath(prettierConfigPath))
    }

    async prompting() {
        const { className, methodName } = await this.prompt([
            {
                type: 'input',
                name: 'className',
                message:
                    'What is the owning class name? (leave blank for an exported function)',
            },
            {
                type: 'input',
                name: 'methodName',
                message: 'What is the method under test?',
            },
        ])

        const isClassMethod = className.length > 0

        const testTitles = await this._getTestTitle([])

        this.inputArgs = {
            isClassMethod,
            className,
            methodName,
            testTitles,
        }
    }

    async _getTestTitle(prevTitles) {
        const { title } = await this.prompt([
            {
                type: 'input',
                name: 'title',
                message: `Describe a test case (leave blank to finish). "It..." `,
            },
        ])
        if (title.length > 0) {
            return this._getTestTitle([...prevTitles, title])
        }
        return prevTitles
    }

    async writing() {
        if (this.options['dry-run']) {
            this.log(
                'Received the following inputs:',
                JSON.stringify(this.inputArgs, null, 2)
            )
            return
        }

        const templateFileName = this._getTemplateFileName()
        const destinationFileName = this._getDestinationFileName()
        this.fs.copyTpl(
            this.templatePath(templateFileName),
            path.join(this.contextRoot, destinationFileName),
            this.inputArgs
        )
        this.queueTransformStream(prettier(this.prettierConfig))
    }

    _getTemplateFileName() {
        return this.inputArgs.isClassMethod ? 'classMethod.js' : 'function.js'
    }

    _getDestinationFileName() {
        // TODO: Configurable to be test or spec & js or ts
        return this.inputArgs.isClassMethod
            ? `${this.inputArgs.className}.${this.inputArgs.methodName}.test.js`
            : `${this.inputArgs.methodName}.test.js`
    }
}
