const glob = require('glob-all')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const parts = require('./webpack.parts')

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

process.traceDeprecation = true
process.noDeprecation = true

const commonConfig = merge([
  {
    entry: {
      app: ['babel-polyfill', PATHS.app]
    },
    output: {
      path: PATHS.build,
      filename: 'js/[name].js'
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  },
  parts.loadPug({
    options: {
      pretty: true
    }
  }),
  parts.loadFonts({
    options: {
      name: 'fonts/[name].[hash:8].[ext]'
    }
  })
])

const productionConfig = merge([
  {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 250000,
      maxAssetSize: 450000
    },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: 'js/[name].[chunkhash:8].js',
      publicPath: '/webpack3-demo/'
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin()
    ]
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      safe: true
    }
  }),
  parts.extractBundles([
    {
      name: 'vendor',
      minChunks: ({ resource }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      )
    },
    {
      name: 'manifest',
      minChunks: Infinity
    }
  ]),
  parts.generateSourceMaps({ type: 'source-map' }),
  parts.extractCSS({
    use: ['css-loader', parts.autoprefixer(), 'postcss-loader', 'sass-loader']}),
  parts.purifyCSS({
    paths: glob.sync([
      `${PATHS.app}/**/*.js`,
      `${PATHS.app}/view/**/*.pug`
    ])
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: 'images/[name].[hash:8].[ext]'
    }
  }),
  parts.optimizeImages({
    // test: `${PATHS.app}/assets/images/**`
    test: /\.(jpe?g|png|gif|svg)$/i
  }),
  parts.loadJavaScript({ include: PATHS.app }),
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    'production'
  )
])

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
  parts.devServer({
    historyApiFallback: true,
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS(),
  parts.loadImages()
])

module.exports = (env) => {
  const pages = [
    parts.page({
      title: 'Webpack demo',
      filename: 'index.html'
    }),
    parts.page({
      title: 'Page1 demo',
      template: `${PATHS.app}/view/page1.pug`,
      filename: 'page1.html'
    })
  ]

  const config = env === 'production' ? productionConfig : developmentConfig

  return pages.map(page => merge(commonConfig, config, page))
}
