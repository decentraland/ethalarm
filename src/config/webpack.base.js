import webpack from 'webpack'
import path from 'path'

export default {
  output: {
    filename: '[name].[hash].js',
    publicPath: '/',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.s?css/,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader'
        }, {
            loader: 'sass-loader'
        }]
      }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../webapp')
    }
  },
}
