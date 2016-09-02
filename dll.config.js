const webpack = require('webpack')
const path = require('path')

const vendors = [
  'react',
  'react-dom'
]

module.exports = {
  output: {
    path: path.resolve(__dirname, 'static', 'libs'),
    filename: 'dll.[name].js',
    library: '[name]'
  },
  entry: {
    'lib': vendors
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, 'dll.json'),
      name: '[name]',
      context: '.'
      // context: __dirname
    }),
    new webpack.optimize.OccurenceOrderPlugin()
    // new webpack.optimize.UglifyJsPlugin()
  ],
  resolve: {
    // root: path.resolve(__dirname, "client"),
    modulesDirectories: ['node_modules']
  }
}

// 作者：Stark伟
// 链接：https://zhuanlan.zhihu.com/p/21748318
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
