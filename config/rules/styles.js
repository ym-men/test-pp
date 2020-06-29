const paths = require('../paths');

module.exports = () => [
  {
    test: /\.(styl)$/,
    use: [
       require.resolve('style-loader'),
       'css-loader?modules,localIdentName="[name]-[local]-[hash:base64:6]"',
       {
          loader: "stylus-loader", // compiles Stylus to CSS
          options: {
             preferPathResolver: 'webpack',
          }
       }
    ],
 },
 {
    test: /\.(css)$/,
    use: [
       require.resolve('style-loader'),
       'css-loader'
    ],
 },
];
