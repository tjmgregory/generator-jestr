# generator-jestr

[![npm version](https://badge.fury.io/js/generator-jestr.svg)](https://badge.fury.io/js/generator-jestr)

Save time writing [Jest](https://jestjs.io/) unit test boilerplate without an IDE.

[![asciicast](https://asciinema.org/a/422434.svg)](https://asciinema.org/a/422434)

### Features

- Support for JavaScript and TypeScript 🔨
- Applies your local [Prettier](https://prettier.io/) configuration when generating tests 💅 (WIP, see [this issue](https://github.com/tjmgregory/generator-jestr/issues/5))

# Getting started

### Installation

```sh
npm install --dev yo
npm install --dev generator-jestr
```

### Usage

```sh
cd path-to-where-you-would-like-your-new-test-file
yo jestr
```


### Configuration

On first run, yeoman will create a `.yo-rc.json` for you with all the defaults. This file should be placed at the root of your project.

| .yo-rc.json        | CLI arg    | Options    | Description                                                           |
|--------------------|------------|------------|-----------------------------------------------------------------------|
| `defaultLanguage`    | `--language` | `js`, `ts` | Which language you would like the output test files to be written in. |
| `prettierConfigPath` | n/a        | string     | The path from the .yo-rc.json to your prettier configuration.         |
