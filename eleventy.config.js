const { HtmlBasePlugin } = require("@11ty/eleventy");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Serve from a sub-path (/repo-name/) on GitHub Pages until the custom domain lands.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Cache-bust CSS/JS: content hash so HTML and assets deploy in lockstep.
  eleventyConfig.addFilter("assetHash", (assetPath) => {
    const file = path.join(__dirname, "src", assetPath.replace(/^\//, ""));
    try {
      const hash = crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex").slice(0, 10);
      return `${assetPath}?v=${hash}`;
    } catch {
      return assetPath;
    }
  });

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  eleventyConfig.addFilter("slug2", (str) =>
    String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
