const COMMENT_REGEX = require("html-comment-regex");
const applyRanges = require("ranges-apply");
const IS_WHITESPACE_REGEX = /\s/;
const WHITESPACE_AT_START_REGEX = /^\s*/;
const WHITESPACE_AT_END_REGEX = /\s*$/;

function isWhitespace(char) {
  return IS_WHITESPACE_REGEX.test(char);
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
    const previousChar = str.charAt(startIndex - 1);
    const nextChar = str.charAt(endIndex);

    comments.push({
      hasLeadingWhitespace: isWhitespace(previousChar),
      hasTrailingWhitespace: isWhitespace(nextChar),
    });
  }

  return comments;
}

function restore(str, comments = []) {
  let ranges = [];
  let i = 0;

  if (countMatches(str, COMMENT_REGEX) !== comments.length) {
    return str;
  }

  while ((result = COMMENT_REGEX.exec(str)) !== null) {
    const [match] = result;
    const startIndex = COMMENT_REGEX.lastIndex - match.length;
    const endIndex = COMMENT_REGEX.lastIndex;
    const { hasLeadingWhitespace, hasTrailingWhitespace } = comments[i];

    const previousChar = str.charAt(startIndex - 1);
    const nextChar = str.charAt(endIndex);

    /**
     * If this comment is not suppose to have leading whitespace
     * and it does, get the range of the whitespace before the
     * comment to be removed.
     */
    if (!hasLeadingWhitespace && isWhitespace(previousChar)) {
      const [whitespace] = WHITESPACE_AT_END_REGEX.exec(
        str.substring(0, startIndex)
      );
      ranges.push([startIndex - whitespace.length, startIndex, ""]);
    }

    /**
     * If this comment is suppose to have leading whitespace
     * and it doesn't, add in a whitespace char
     */
    if (hasLeadingWhitespace && !isWhitespace(previousChar)) {
      ranges.push([startIndex, startIndex, " "]);
    }

    /**
     * If this comment is not suppose to have trailing whitespace
     * and it does, get the range of the whitespace after the
     * comment to be removed.
     */
    if (!hasTrailingWhitespace && isWhitespace(nextChar)) {
      const [whitespace] = WHITESPACE_AT_START_REGEX.exec(
        str.substring(endIndex)
      );
      ranges.push([endIndex, endIndex + whitespace.length, ""]);
    }

    /**
     * If this comment is suppose to have leading whitespace
     * and it doesn't, add in a whitespace char
     */
    if (hasTrailingWhitespace && !isWhitespace(previousChar)) {
      ranges.push([endIndex, endIndex, " "]);
    }

    i++;
  }

  return applyRanges(str, ranges);
}

module.exports = { preserve, restore };
