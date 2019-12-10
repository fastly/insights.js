class HtmlApiTokenPlugin {
  constructor({ apiToken }) {
    this.apiToken = apiToken;
  }

  getMainTag(data) {
    return data.body.find(t => t.attributes.src.match(/\/main/));
  }

  getSrc(tag) {
    return tag.attributes.src;
  }

  srcWithToken(src) {
    return `${src}?k=${this.apiToken}`;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlApiTokenPlugin', (compilation) => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
        'HtmlApiTokenPlugin', (data) => {
          const tag = this.getMainTag(data);
          const src = this.getSrc(tag);
          tag.attributes.src = this.srcWithToken(src);
        }
      )
    })
  }
}

module.exports = HtmlApiTokenPlugin;
