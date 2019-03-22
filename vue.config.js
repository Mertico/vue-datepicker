const ImageminPlugin = require("imagemin-webpack");

// Before importing imagemin plugin make sure you add it in `package.json` (`dependencies`) and install
const imageminGifsicle = require("imagemin-gifsicle");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");

module.exports = {
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
    },
    plugins: [
      // Make sure that the plugin is after any plugins that add images, example `CopyWebpackPlugin`
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        cache: true,
        imageminOptions: {
          // Lossless optimization with custom option
          // Feel free to experement with options for better result for you
          plugins: [
            imageminGifsicle({
              interlaced: true
            }),
            imageminMozjpeg({
              progressive: true,
              quality: 80
            }),
            imageminPngquant({
              speed: 1,
              quality: [0.95, 1], //lossy settings
              optimizationLevel: 5
            }),
            imageminSvgo({
              removeViewBox: true
            })
          ]
        }
      })
    ]
  },
  css: {
    extract: false
  },
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
