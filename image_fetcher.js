var request = require('request');
var fs = require('fs');

module.exports.fetchImage = function(url, localPath) {
  request(url).pipe(fs.createWriteStream(localPath));
}
