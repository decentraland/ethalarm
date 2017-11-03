import htmlPlugin from 'html-webpack-plugin'

import base from './webpack.base'

export default Object.assign({}, base, {
  devtool: 'hidden-source-map',
  entry: {
    'app': [
      'babel-polyfill',
      './src/webapp/main.js',
    ]
  },
  plugins: [
    new htmlPlugin({ template: 'public/index.html' }),
  ]
})
