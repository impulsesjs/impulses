# Impulses Contributing Guide
Before submitting your contribution, please make sure to take a moment and read through the following guidelines.

- [Code of Conduct](https://github.com/impulsesjs/impulses/blob/dev/.github/CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Issue Reporting Guidelines

- Always use [https://impulses.vuejs.org/](https://new-issue.vuejs.org/) to create new issues.

## Pull Request Guidelines

- The `master` branch is basically just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.

- Work in the `src` folder and **DO NOT** checkin `lib` in the commits.

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

- Make sure `npm test` passes. (see [development setup](#development-setup))

- If adding new feature:
  - Add accompanying test case.
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

- If fixing a bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

## Development Setup
 > **NOTE**: In the near future we will be adding a folder `build` so we have docker running all processes without the need of NodeJs installation
 
You will need [Node.js](http://nodejs.org) **version 6+** and [Java Runtime Environment](http://www.oracle.com/technetwork/java/javase/downloads/index.html) (needed for running Selenium server during e2e tests).

After cloning the repo, run:

``` bash
$ npm install # or yarn
```

### Committing Changes
Commit messages should follow the [commit message convention](./COMMIT_CONVENTION.md) so that changelogs can be automatically generated. Commit messages will be automatically validated upon commit. If you are not familiar with the commit message convention, you can use `npm run commit` instead of `git commit`, which provides an interactive CLI for generating proper commit messages.

### Commonly used NPM scripts

``` bash
# watch and auto re-build lib/inpulses.js
$ npm run dev

# build all dist files, including npm packages
$ npm run build

# run the full test suite, include linting
$ npm test
```

There are some other scripts available in the `scripts` section of the `package.json` file.

The default test script will do the following: lint with ESLint -> unit tests with coverage. **Please make sure to have this pass successfully before submitting a PR.** Although the same tests will be run against your PR on the CI server, it is better to have it working locally beforehand.

## Project Structure
- **`scripts`**: contains build-related scripts and configuration files. In most cases you don't need to touch them. However, it would be helpful to familiarize yourself with the following files:

  - `scripts/alias.js`: module import aliases used across all source code and tests.

  - `scripts/config.js`: contains the build configurations for all files found in `lib/`. Check this file if you want to find out the entry source file for a dist file.

- **`lib`**: contains built files for distribution. Note this directory is only updated when a release happens; they do not reflect the latest changes in development branches.

- **`test`**: contains all tests. The unit tests are written with [Jasmine](http://jasmine.github.io/2.3/introduction.html) and run with [Karma](http://karma-runner.github.io/0.13/index.html). The e2e tests are written for and run with [Nightwatch.js](http://nightwatchjs.org/).

- **`src`**: contains the source code, obviously. The codebase is written in ES2015.

## Financial Contribution
As a pure community-driven project without major corporate backing, we also welcome financial contributions via Patreon or OpenCollective.

- [Become a backer or sponsor on Patreon](https://www.patreon.com/joaocorreia)
- [Become a backer or sponsor on OpenCollective](https://opencollective.com/impulses)

### What's the difference between Patreon and OpenCollective?
Funds donated via Patreon go directly to support Joao Correia full-time work on impulses.js and many other ideas. Funds donated via OpenCollective are managed with transparent expenses and will be used for compensating work and expenses for core team members or sponsoring community events. Your name/logo will receive proper recognition and exposure by donating on either platform.

## Credits
Thank you to all the people who have already contributed to Impulses!

<a href="https://github.com/impulsesjs/impulses/graphs/contributors"><img src="https://opencollective.com/impulses/contributors.svg?width=890" /></a>