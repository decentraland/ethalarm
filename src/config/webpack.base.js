import path from 'path'

export default {
  output: {
    filename: '[name].[hash].js',
    publicPath: '/',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?mimetype=image/svg+xml'
      },
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
