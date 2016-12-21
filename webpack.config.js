const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const pkg = require('./package.json')
// Adds a banner to the top of each generated chunk.
const banner = `
${pkg.description}
v${pkg.version} ©${new Date().getFullYear()} ${pkg.author}
${pkg.homepage}
`.trim()

const isProd = process.env.NODE_ENV === 'production'


const favicon = false//conf.favicon ? path.resolve(__dirname, './src/conf.json', conf.favicon) : false
// "autoprefixer": "^6.4.0",
module.exports = {
  entry:{
      app:'./src/main.js',
      vendor: [
    //  'es6-promise',
      'wilddog',
      'wildvue',
      'vue',
      'vue-router',
      'vuex',
      'vuex-router-sync'],
  }, 
 
  output: {
   // path: './dist',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: isProd ? '[name].[chunkhash:5].js' : '[name].js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    //  'jquery':'./static/js/jquery.min.js',
    //  'jqueryfiler':'./static/js/jquery.filer.min.js'
    }
  },
  module: {
    rules: [
      // preLoaders
 /*     {
        test: /\.vue$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/
      },*/
      // Loaders
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: path.posix.join('images','[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: path.posix.join('fonts','[name].[hash:7].[ext]')
        }
      }

    ],
    noParse: [
      /\.min\.js$/,
      /es6-promise\.js$/
    ]
  },
  plugins: [
  /*  new webpack.ProvidePlugin({
       $:'jquery',
       jQuery:'jquery',
       "window.jquery":'jquery'
    }),*/
    new webpack.optimize.CommonsChunkPlugin({
               names: ['vendor', 'manifest']
            }),
    new webpack.LoaderOptionsPlugin({
      vue: {
        loaders: {
          stylus: ExtractTextPlugin.extract({
            loader: 'css-loader?{discardComments:{removeAll:true}}!stylus-loader',
            fallbackLoader: 'vue-style-loader'
          })
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'tpl.html'),
      filename: 'index.html',
      favicon: 'favicon.ico',
      minify: {
        // https://github.com/kangax/html-minifier#options-quick-reference
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new ExtractTextPlugin({
      filename: isProd ? '[name].[chunkhash:5].css' : '[name].css',
      disable: false,
      allChunks: true
    })
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    //contentBase: 'dist/',
    contentBase: [path.join(__dirname, "dist/"), path.join(__dirname, "static/")],
    host: '0.0.0.0'
  },
  devtool: isProd ? false : '#eval-source-map'
}

// production build setting
if (isProd) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
   
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.BannerPlugin(banner)
  ])
}