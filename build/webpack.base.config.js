const path = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject(mainChunk) {
    return {};
  }
}

const config = require('./config')[process.env.NODE_ENV || 'development']
const isProd = process.env.NODE_ENV === 'production'

let baseConfig = {
  mode: config.mode,
  devtool: config.devtool,
  output: {
    path: config.path,
    filename: config.filename,
    chunkFilename: config.chunkFilename,
    publicPath: config.publicPath,
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'public': path.resolve(__dirname, '../public')
    }
  },
  performance: {
    hints: false
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // enable CSS extraction
          extractCSS: isProd
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: isProd
          ? [ServerMiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
          : ['vue-style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: isProd
          ? [ServerMiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
          : ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: isProd
    ? [
        new ServerMiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'common.[chunkhash].css'
        }),
        // 请确保引入这个插件！
        new VueLoaderPlugin()
      ]
    : [
      new VueLoaderPlugin(),
      new FriendlyErrorsPlugin()
    ]
}

if (isProd) {
  baseConfig = merge(baseConfig, {
    optimization: {
      minimizer: [
        // PS: 不要用uglifyjs-webpack-plugin,会报错
        new TerserPlugin({
          cache: true,
          parallel: true,
        }),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessorOptions: {
            safe: true,
            autoprefixer: { disable: true },
            mergeLonghand: false,
            discardComments: {
              removeAll: true
            }
          },
          canPrint: true
        })
      ],
  
      splitChunks: {
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 20
          },
          default: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true
          }
        }
      }
    },
  }) 
}

module.exports = baseConfig
