# preserve-comment-whitespace

> Preserves the presence or lack thereof of whitespace surrounding HTML comments.

[![codecov](https://codecov.io/gh/useparcel/preserve-comment-whitespace/branch/main/graph/badge.svg?token=J5OFD5Z4GF)](https://codecov.io/gh/useparcel/preserve-comment-whitespace)
[![npm package](https://img.shields.io/npm/v/preserve-comment-whitespace.svg)](https://www.npmjs.com/package/preserve-comment-whitespace)
[![Twitter Follow](https://img.shields.io/twitter/follow/useparcel.svg?style=social)](https://twitter.com/useparcel)

HTML formatters don't always properly handle HTML comments. This package attempts to properly maintain the whitespace around the HTML comments.

Some known issues:
* https://github.com/beautify-web/js-beautify/issues/1301
* https://github.com/beautify-web/js-beautify/issues/1823

## Install 

```
$ npm install preserve-comment-whitespace
```

## Usage

```js
const { preserve, restore } = require('preserve-comment-whitespace');
const beautify = require('js-beautify').html;

const html = `<div><div><!-- my html comment --></div></div>`

const comments = preserve(html);
const formatted = beautify(html);
//=> <div>\n    <div>\n        <!-- my html comment -->\n    </div>\n</div>
const formattedAndRestored = restore(formatted, comments)
//=> <div>\n    <div><!-- my html comment --></div>\n</div>
```

## API

### preserve(html)

Returns an Array containing the objects descripting the HTML comments.

### restore(html, comments, options)

Returns a string where the whitespace around the HTML comments is restored.

**Note:** the processing between `preserve` and `restore` should add or remove any comments. If the number of comments given don't match the number of comments found in the given HTML, `restore` will return the given string, unprocessed.

#### html
> `String` | required

String of HTML after any formatting that would have affected the whitespace.

#### comments
> `Array` | defaults to `[]`

The Array returned from `preserve`.

#### options
> `Object` | defaults to `{ restoreInline: true }`

Configuration for how to restore the comment whitespace.

Accept `restoreInline`. If `true`, comments that were originally inline (i.e. not on their own lines) will be restored to be inline. Otherwise, it will accept the new line placement.

## Related

* [find-conditional-comments](https://www.npmjs.com/package/find-conditional-comments)
* [regex-empty-conditional-comments](https://www.npmjs.com/package/regex-empty-conditional-comments)
* [posthtml-mso](https://www.npmjs.com/package/posthtml-mso)
* [html-comment-regex](https://www.npmjs.com/package/html-comment-regex)
