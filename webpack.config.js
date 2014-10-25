var webpack = require('webpack');

module.exports = {
  context : __dirname,
  entry : [
    './app/components/Application'
  ],
  output : {
    path: __dirname,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {test: /\.jsx$/, loaders: ['jsx-loader?harmony&insertPragma=React.DOM']},
      {test: /\.es6\.js$/, loader: 'es6-loader'},

      // compile and include less files
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      // compile and include less files
      {test: /\.less$/, loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'},

      // allow less files to load urls pointing to font assets
      // @TODO: figure out why this is necessary and do it better
      {test: /\.(woff|ttf|eot|svg)$/, loader: 'file-loader' }
    ]
  },
  resolve : {
    extensions: ['', '.js', '.es6.js', '.jsx'],
    alias : {
      components : __dirname + '/app/components',
      actions : __dirname + '/app/actions',
      constants : __dirname + '/app/constants',
      stores : __dirname + '/app/stores',
      mixins : __dirname + '/app/mixins',
      styles : __dirname + '/app/styles'
    }
  }
};