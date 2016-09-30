const path = require('path')
const webpack = require('webpack')

module.exports = {
  cache: true,
  devtool: 'source-map', // or cheap-module-eval-source-map (eval) https://github.com/reactjs/redux/issues/809
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'web-src', 'app.jsx')
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static')
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    // new webpack.optimize.OccurenceOrderPlugin(),
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
  // externals: {
  //   // Use external version of React
  //   "react": "React",
  //   "react-dom": "ReactDOM",
  //   "redux": "redux",
  //   "react-router": "react-router"
  //   // "redux-thunk": "redux-thunk",
  //   // "redux-logger": "redux-logger"
  // },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'bower_components']
  }
}
