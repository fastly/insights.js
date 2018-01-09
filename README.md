# Insights.js [![Travis Build Status][travis-img]][travis]
Real user monitoring 

[travis]: https://travis-ci.com/fastly/insights.js
[travis-img]: https://travis-ci.com/fastly/insights.js.svg?token=i6WATLrpQktJR1HWpL2Y&branch=master

## Quick links
- [FAQ](#faq)
- [Installation](#installation)
- [Running](#running)

## Installation

### Requirements
- Node.js >= 6 (```brew install node```)
- Yarn (```brew install yarn```)

### Install
```sh
git clone git@github.com:fastly/insights.js.git
cd insights.js
yarn
yarn run build
```

### Running
Most actions you'd like to perform whilst developing insights.js are defined as NPM scripts tasks and can be invoked using `yarn run {task}`.

A list of all commands and their description can be found below.


Name                   | Description
-----------------------|-----------------------------
clean | Cleans the working directory of all compiled artefacts from the `dist` directory
build-development | Compiles the application for development
build-production | Compiles the application for production environments
build | Verifies and compiles the source
format | Automatically formats the source files using prettier
lint | Lints the source files for style errors using ESLint
verify | Runs the format and lint
unit-test | Runs the unit test suite
test | Runs verify and unit-test


## FAQ
TODO
