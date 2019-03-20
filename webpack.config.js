const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const developmentConfig = {
  mode: 'development',
  entry: ['./dev/index.js'],
  output: {
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        enforce: 'pre',
        use: [{
            loader: 'prettier-loader',
            options: {
                parser: 'babel'
            }
        },{
            loader: 'eslint-loader',
            options: {
              fix: true
            }
        }]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  devtool: 'eval-source-map',
}

const productionConfig = {
  mode: 'production',
  entry: {
      index: ['./src/index.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
  },
  devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
        globalObject: 'window',
    }
}

module.exports = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig
