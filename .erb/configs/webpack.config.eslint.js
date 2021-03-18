require('../.erb/scripts/node_modules/@babel/register');

module.exports = require('./webpack.config.renderer.dev.babel').default;
