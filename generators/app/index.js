var Generator = require('yeoman-generator')
var path = require('path')
var prettier = require('gulp-prettier')

const DEFAULT_PRETTIER_CONFIG = {
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'es5',
}

const SUPPORTED_LANGUAGES = {
    js: 'js',
    javascript: 'js',
    ts: 'ts',
    typescript: 'ts',
}

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts)

        this.config.defaults({
            defaultLanguage: 'ts',
            prettierConfigPath: '.prettierrc.js',
        })

        this.option('dry-run', {
            description: 'Perform a dry run and log the result.',
            type: Boolean,
            default: false,
        })

        this.option('language', {
            description: 'The language of the output files.',
            type: String,
        })
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

    async configuring() {
        await this._configureLanguage()
    }

    async _configureLanguage() {
        this.language =
            SUPPORTED_LANGUAGES[this.options['language']] ??
            SUPPORTED_LANGUAGES[this.config.get('defaultLanguage')]
        this.log('LANGUAGE')
        this.log(this.language)

        if (!this.language) {
            this.log(
                `Your chosen language could not be understood, defaulting to javascript.\nPossible options are: ${JSON.stringify(
                    Object.keys(SUPPORTED_LANGUAGES)
                )}`
            )
            this.language = SUPPORTED_LANGUAGES.js
        }
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

    _getLanguageFileExtension() {
        const chosenLanguage = this.language.toLowerCase()
        switch (chosenLanguage) {
            case 'js':
            case 'javascript':
                return 'js'
            case 'ts':
            case 'typescript':
                return 'ts'
            default:
                this.log(
                    'Chosen language not understood, defaulting to javascript.'
                )
                return 'js'
        }
    }

    _getTemplateFileName() {
        const extension = this._getLanguageFileExtension()
        return this.inputArgs.isClassMethod
            ? `classMethod.${extension}`
            : `function.${extension}`
    }

    _getDestinationFileName() {
        // TODO: Configurable to be test or spec & js or ts
        const extension = this._getLanguageFileExtension()
        return this.inputArgs.isClassMethod
            ? `${this.inputArgs.className}.${this.inputArgs.methodName}.test.${extension}`
            : `${this.inputArgs.methodName}.test.${extension}`
    }
}
