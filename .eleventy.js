module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("byCategory", (items, category) =>
    items.filter((item) => item.data.category === category)
  );

  eleventyConfig.addCollection("members", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/members/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  eleventyConfig.addCollection("events", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/events/*.md")
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  );

  eleventyConfig.addCollection("readingList", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/reading-list/*.md")
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
  );

  eleventyConfig.addCollection("bulletin", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/bulletin/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
