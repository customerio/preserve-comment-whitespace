const { preserve, restore } = require(".");

describe("preserve", () => {
  /**
   * all combos of spacing: none, open, close, open and close
   */
  test("preserves comments correctly", () => {
    expect(preserve(`<div><!--hello world--></div>`)[0]).toMatchObject({
      hasLeadingWhitespace: false,
      hasTrailingWhitespace: false,
    });
    expect(preserve(`<div> <!--hello world--></div>`)[0]).toMatchObject({
      hasLeadingWhitespace: true,
      hasTrailingWhitespace: false,
    });
    expect(preserve(`<div><!--hello world--> </div>`)[0]).toMatchObject({
      hasLeadingWhitespace: false,
      hasTrailingWhitespace: true,
    });
    expect(preserve(`<div> <!--hello world--> </div>`)[0]).toMatchObject({
      hasLeadingWhitespace: true,
      hasTrailingWhitespace: true,
    });
  });

  test("preserves comments with new lines inside of them", () => {
    expect(preserve(`<div> <!--hello\nworld--> </div>`)[0]).toMatchObject({
      hasLeadingWhitespace: true,
      hasTrailingWhitespace: true,
    });
  });

  test("preserves comments with tabs and new lines ", () => {
    expect(preserve(`<div>\n<!--hello world-->\n</div>`)[0]).toMatchObject({
      hasLeadingWhitespace: true,
      hasTrailingWhitespace: true,
    });
    expect(preserve(`<div>\t<!--hello world-->\t</div>`)[0]).toMatchObject({
      hasLeadingWhitespace: true,
      hasTrailingWhitespace: true,
    });
  });

  test("preserves multiple comments", () => {
    const comments = preserve(
      `<div>\t<!--first comment-->\t<!--second comment--></div>`
    );
    expect(comments[0]).toMatchObject({
      hasLeadingWhitespace: true,
      hasTrailingWhitespace: true,
    });
    expect(comments[1]).toMatchObject({
      hasLeadingWhitespace: true,
      hasTrailingWhitespace: false,
    });
  });
});

describe("restore", () => {
  test("makes no changes when there are no comments", () => {
    const html = "hello world";
    expect(restore(html)).toBe(html);
  });

  test("makes no changes when there are no changes to the whitespace", () => {
    const html = "<div>\n<!--hello world-->\n</div>";
    expect(
      restore(html, [
        { hasLeadingWhitespace: true, hasTrailingWhitespace: true },
      ])
    ).toBe(html);
  });

  test("returns the original string if there are a mismatched number of comments", () => {
    /**
     * Expected 1 was given 2
     *
     * It would remove the second '\n' but it doesn't since they don't match up
     */
    expect(
      restore(`<div>\n<!--hello world-->\n</div>`, [
        { hasLeadingWhitespace: true, hasTrailingWhitespace: false },
        { hasLeadingWhitespace: true, hasTrailingWhitespace: true },
      ])
    ).toBe(`<div>\n<!--hello world-->\n</div>`);

    /**
     * Expected 2 was given 1
     *
     * It would remove the second '\n' but it doesn't since they don't match up
     */
    expect(
      restore(
        `<div>\n<!--hello world-->\n</div><div>\n<!--hello world-->\n</div>`,
        [{ hasLeadingWhitespace: true, hasTrailingWhitespace: false }]
      )
    ).toBe(
      `<div>\n<!--hello world-->\n</div><div>\n<!--hello world-->\n</div>`
    );
  });

  test("restores leading whitespace after it is removed", () => {
    expect(
      restore("<div><!--hello world--></div>", [
        { hasLeadingWhitespace: true, hasTrailingWhitespace: false },
      ])
    ).toBe("<div> <!--hello world--></div>");
  });

  test("restores leading lack of whitespace after it is added", () => {
    expect(
      restore("<div> <!--hello world--></div>", [
        { hasLeadingWhitespace: false, hasTrailingWhitespace: false },
      ])
    ).toBe("<div><!--hello world--></div>");
  });

  test("restores trailing whitespace after it is removed", () => {
    expect(
      restore("<div><!--hello world--></div>", [
        { hasLeadingWhitespace: false, hasTrailingWhitespace: true },
      ])
    ).toBe("<div><!--hello world--> </div>");
  });

  test("restores trailing lack of whitespace after it is added", () => {
    expect(
      restore("<div><!--hello world--> </div>", [
        { hasLeadingWhitespace: false, hasTrailingWhitespace: false },
      ])
    ).toBe("<div><!--hello world--></div>");
  });
});
