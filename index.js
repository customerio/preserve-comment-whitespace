const COMMENT_REGEX = require("html-comment-regex");
const applyRanges = require("ranges-apply/dist/ranges-apply.cjs.js");
const IS_WHITESPACE_REGEX = /\s+/;
const WHITESPACE_AT_START_REGEX = /^\s*/;
const WHITESPACE_AT_END_REGEX = /\s*$/;

function last(arr) {
  return arr[arr.length - 1];
}

function first(arr) {
  return arr[0];
}

function isWhitespace(str) {
  return IS_WHITESPACE_REGEX.test(str);
}

function hasNewLine(str) {
  return str.includes("\n");
}

const countMatches = (str, regex) => {
  return (str.match(regex) || []).length;
};

function preserve(str) {
  let comments = [];

  let result;
  while ((result = COMMENT_REGEX.exec(str)) !== null) {
    const [match] = result;
    const startIndex = COMMENT_REGEX.lastIndex - match.length;
    const endIndex = COMMENT_REGEX.lastIndex;

    const [leadingWhitespace] = WHITESPACE_AT_END_REGEX.exec(
      str.substring(0, startIndex)
    );
    const [trailingWhitespace] = WHITESPACE_AT_START_REGEX.exec(
      str.substring(endIndex)
    );

    comments.push({
      leadingWhitespace,
      trailingWhitespace,
      hasLeadingWhitespace: !!leadingWhitespace,
      hasTrailingWhitespace: !!trailingWhitespace,
    });
  }

  return comments;
}

function restore(str, comments = [], options = { restoreInline: true }) {
  let ranges = [];
  let i = 0;

  if (countMatches(str, COMMENT_REGEX) !== comments.length) {
    return str;
  }

  while ((result = COMMENT_REGEX.exec(str)) !== null) {
    const [match] = result;
    const startIndex = COMMENT_REGEX.lastIndex - match.length;
    const endIndex = COMMENT_REGEX.lastIndex;
    const {
      hasLeadingWhitespace,
      hasTrailingWhitespace,
      leadingWhitespace,
      trailingWhitespace,
    } = comments[i];
    const [newLeadingWhitespace] = WHITESPACE_AT_END_REGEX.exec(
      str.substring(0, startIndex)
    );
    const [newTrailingWhitespace] = WHITESPACE_AT_START_REGEX.exec(
      str.substring(endIndex)
    );

    /**
     * If this comment is not suppose to have leading whitespace
     * and it does, get the range of the whitespace before the
     * comment to be removed.
     */
    if (!hasLeadingWhitespace && isWhitespace(newLeadingWhitespace)) {
      ranges.push([startIndex - newLeadingWhitespace.length, startIndex, ""]);
    }

    /**
     * restore correct leading whitespace
     */
    if (hasLeadingWhitespace) {
      // if it is now has no whitespace, restore the whitespace until the first new line
      if (!isWhitespace(newLeadingWhitespace)) {
        ranges.push([
          startIndex,
          startIndex,
          last(leadingWhitespace.split("\n")),
        ]);
      }

      // it is now on it's own line and it wasn't before, replace it the whitespace until the first new line
      else if (
        options.restoreInline &&
        hasNewLine(newLeadingWhitespace) &&
        !hasNewLine(leadingWhitespace)
      ) {
        ranges.push([
          startIndex - newLeadingWhitespace.length,
          startIndex,
          last(leadingWhitespace.split("\n")),
        ]);
      } else {
        // it has ok whitespace so leave it alone
      }
    }

    /**
     * If this comment is not suppose to have trailing whitespace
     * and it does, get the range of the whitespace after the
     * comment to be removed.
     */
    if (!hasTrailingWhitespace && isWhitespace(newTrailingWhitespace)) {
      ranges.push([endIndex, endIndex + newTrailingWhitespace.length, ""]);
    }

    /**
     * restore correct trailing whitespace
     */
    if (hasTrailingWhitespace) {
      // if it is now has no whitespace, restore the whitespace until the first new line
      if (!isWhitespace(newTrailingWhitespace)) {
        ranges.push([
          endIndex,
          endIndex,
          first(trailingWhitespace.split("\n")),
        ]);
      }

      // it is now on it's own line and it wasn't before, replace it the whitespace until the first new line
      else if (
        options.restoreInline &&
        hasNewLine(newTrailingWhitespace) &&
        !hasNewLine(trailingWhitespace)
      ) {
        ranges.push([
          endIndex,
          endIndex + newTrailingWhitespace.length,
          first(trailingWhitespace.split("\n")),
        ]);
      } else {
        // it has ok whitespace so leave it alone
      }
    }

    i++;
  }

  return applyRanges(str, ranges);
}

module.exports = { preserve, restore };
