const path = require('path');

module.exports = {
  typescript: {
    enableTypeChecking: true
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          path: require.resolve("path-browserify")
        }
      }
    }
  },
}; 