const paths = require('../paths');

module.exports = () => [
  {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
       limit: 10000,
       name: 'static/media/[name].[hash:8].[ext]',
    },
 },
];
