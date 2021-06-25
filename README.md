# generator-jestr

Save time writing [Jest](https://jestjs.io/) unit test boilerplate without an IDE.

### Features

- Support for JavaScript and TypeScript 🔨
- Applies your local [Prettier](https://prettier.io/) configuration when generating tests 💅 (WIP, see [this issue](https://github.com/tjmgregory/generator-jestr/issues/5))

## Setup

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

```json
// .yo-rc.json
// To be placed at the root of your project, see https://yeoman.io/authoring/file-system.html
{
    "generator-jestr": {
        "prettierConfigPath": ".prettierrc.js",
        "defaultLanguage": "ts"
    }
}
```
