import webpack from 'webpack'
import htmlPlugin from 'html-webpack-plugin'

import base from './webpack.base.js'

export default Object.assign({}, base, {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    'app': [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      './src/webapp/main.js',
    ]
  },
  plugins: [
    new htmlPlugin({ template: 'public/index.html' }),
    new webpack.HotModuleReplacementPlugin()
  ]
})
