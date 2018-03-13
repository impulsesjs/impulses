## Git Commit Message Convention

> This was adapted from [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

#### TL;DR:
Messages must be matched by the following regex:

``` js
/^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?: .{1,50}/
```

#### Examples
Appears under "Features" header, `api` subheader:

```
feat(api): add 'comments' option
```

Appears under "Bug Fixes" header, `bus` subheader, with a link to issue #12:

```
fix(bus): remove one time event listeners after triggered

close #12
```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```
perf(queue): improve queue handling

BREAKING CHANGE: The 'timeout' has been removed.
```

The following commit and commit `667eca1` do not appear in the changelog if they are under the same release. If not, the revert commit appears under the "Reverts" header.

```
revert: feat(api): add 'comments' option

This reverts commit 667eca1654a317a13331b17617d973392f415567.
```

### Full Message Format
A commit message consists of a **header**, **body** and **footer**.  The header has a **type**, **scope** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`, `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

### Scope
The scope could be anything specifying place of the commit change. For example `bus`, `channel`, `base`, `api` etc...

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.