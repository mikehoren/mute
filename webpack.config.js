const path = require('path')

module.exports = {
  entry: "./src",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "build.js",
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "examples"),
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },  
}