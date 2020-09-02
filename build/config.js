const path = require('path')
const outputPath = path.resolve(__dirname, '../dist')

module.exports = {
  development: {
    mode: 'development',
    devtool: false,
    path: outputPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: ''
  },
  production: {
    mode: 'production',
    devtool: '#cheap-module-source-map',
    path: outputPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: '/dist/' // 相对于服务(server-relative)
  }
}
