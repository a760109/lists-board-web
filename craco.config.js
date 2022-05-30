module.exports = {
  style: {
    postcssOptions: {},
  },
  webpack: {
    configure: webpackConfig => {
      const { resolve } = webpackConfig;

      // Allow imports outside of `src` folder for purescript dependencies
      webpackConfig.resolve.plugins = resolve.plugins.filter(({ constructor: c }) => !c || c.name !== 'ModuleScopePlugin');

      webpackConfig.ignoreWarnings = [
        {
          message: /Failed to parse source map/,
        },
      ];

      webpackConfig.resolve.symlinks = false;

      const oneOfLoaders = webpackConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

      oneOfLoaders.unshift({
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
              // Pass options to marked
              // See https://marked.js.org/using_advanced#options
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
};
