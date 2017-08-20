const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const BabiliPlugin = require('babili-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    // hot: true,
    hotOnly: true,
    host,
    port
  }
})

exports.clean = (path) => ({
  plugins: [
    new CleanWebpackPlugin([path])
  ]
})

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
      }
    ]
  }
})

exports.extractCSS = ({ include, exclude, use }) => {
  const plugin = new ExtractTextPlugin({
    filename: 'styles/[name].[contenthash:8].css'
  })

  return {
    module: {
      rules: [
        {
          test: /\.(scss|sass)$/,
          include,
          exclude,
          use: plugin.extract({
            use,
            fallback: 'style-loader',
            publicPath: '../'
          })
        }
      ]
    },
    plugins: [plugin]
  }
}

exports.autoprefixer = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer')()
    ])
  }
})

exports.purifyCSS = ({ paths }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths })
  ]
})

exports.loadPug = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(pug)$/,
        include,
        exclude,
        use: {
          loader: 'pug-loader',
          options
        }
      }
    ]
  }
})

exports.page = ({
  filename,
  template = require.resolve('./app/view/index.pug'),
  title
} = {}) => ({
  plugins: [
    new HtmlWebpackPlugin({
      filename,
      template,
      title
    })
  ]
})

exports.loadImages = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options
        }
      }
    ]
  }
})

exports.optimizeImages = ({ test } = {}) => ({
  plugins: [
    new ImageminPlugin({
      test,
      optipng: {
        optimizationLevel: 3
      },
      pngquant: {
        quality: '50',
        verbose: true
      }
    })
  ]
})

exports.loadFonts = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,
        use: {
          loader: 'file-loader',
          options
        }
      }
    ]
  }
})

exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    ]
  }
})

exports.generateSourceMaps = ({ type }) => ({
  devtool: type
})

exports.extractBundles = (bundles) => ({
  plugins: bundles.map((bundles) => (
    new webpack.optimize.CommonsChunkPlugin(bundles)
  ))
})

exports.minifyJavaScript = () => ({
  plugins: [
    new BabiliPlugin()
  ]
})

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
})

exports.setFreeVariable = (key, value) => {
  const env = {}
  env[key] = JSON.stringify(value)

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  }
}
