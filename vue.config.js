module.exports = {
  lintOnSave: false, //process.env.NODE_ENV !== 'production',
  chainWebpack: config => {
    config.module.rule("vue" /* or css */).exclude.add([/node_modules/]);

    // Убираю индивидуальные правила которые стоят по дефолту у SVG
    // https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/config/base.js#L105
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();

    config.module
      .rule("svg")
      .test(/\.(svg)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .tap(options => {
        return {
          ...options,
          limit: 10240 // no limit
        };
      });
  },
  pluginOptions: {
    i18n: {
      locale: "ru",
      fallbackLocale: "ru",
      localeDir: "locales",
      enableInSFC: true
    }
  },
  configureWebpack: {
    // No need for splitting
    optimization: {
      splitChunks: false
    },
    output: {
      filename: "vue-datepicker.min.js"
      // libraryTarget: 'commonjs2'
    },
    plugins: []
  },
  // css: {
  //   extract: false
  // },
  productionSourceMap: false,
  // publicPath: process.env.NODE_ENV === 'production'
  // ? '/vue-hotel-datepicker/' // project name
  // : '/'
  publicPath: "./"

  // entry = {
  //   Foo: 'src/components/Foo/index.js', // <component-name>: <component-entry-path>
  //   Bar: 'src/components/Bar/index.js',
  //   FooBar: 'src/components/FooBar/index.js'
  // }
};
