const path = require('path')
const webpack = require('webpack')

module.exports = {
  cache: true,
  devtool: 'eval', // or cheap-module-eval-source-map
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'web-src', 'app.jsx')
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static')
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./dll.json')
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'web-src'),
        loader: 'babel',
        query: {
          plugins: ['syntax-decorators'],
          cacheDirectory: true,
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'bower_components']
  }
  // externals: {
  //   // Use external version of React
  //   "react": "React",
  //   "react-dom": "ReactDOM"
  // },
}
