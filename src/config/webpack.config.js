import webpack from 'webpack'
import htmlPlugin from 'html-webpack-plugin'
import path from 'path'

export default {
  devtool: 'source-map',
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      './webapp/main'
    ]
  },
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
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve('__dirname', '../webapp')
    }
  },
  plugins: [
    new htmlPlugin({ template: 'public/index.html' }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
