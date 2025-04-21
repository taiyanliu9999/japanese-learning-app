const path = require('path');

module.exports = {
  typescript: {
    enableTypeChecking: false
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          path: require.resolve("path-browserify")
        }
      },
      output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
      }
    }
  },
  devServer: {
    hot: true,
    port: 3000,
    historyApiFallback: true,
  }
}; 