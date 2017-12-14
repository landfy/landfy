'use strict';

var axios = require('axios');

var install = async function install(templateName) {
  var source = await axios('https://cdn.rawgit.com/landfy/landing-pages/c77141b5/sources.json');
  console.log('soursssce');

  // return `install ${templateName}`
};

module.exports = install;