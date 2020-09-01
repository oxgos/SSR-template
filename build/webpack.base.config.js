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

const isProd = process.env.NODE_ENV === 'production'

let baseConfig = {
  mode: isProd
    ? 'production'
    : 'development',
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: '[name].[chunkhash].js',
    publicPath: '/dist/' // 相对于服务(server-relative)
  },
  resolve: {
    alias: {
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
        test: /\.(css|less)$/,
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
