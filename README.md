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

### restore(html, comments)

Returns a string where the whitespace around the HTML comments is restored.

## Related

* [find-conditional-comments](https://www.npmjs.com/package/find-conditional-comments)
* [regex-empty-conditional-comments](https://www.npmjs.com/package/regex-empty-conditional-comments)
* [posthtml-mso](https://www.npmjs.com/package/posthtml-mso)
* [html-comment-regex](https://www.npmjs.com/package/html-comment-regex)
