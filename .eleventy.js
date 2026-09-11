module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("members", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/members/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
