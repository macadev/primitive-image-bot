var child_process = require('child_process');
var request = require('request');
var fs = require('fs');

module.exports.transformImage = function(url, image_path, transformed_image_path, callback) {
  var stream = request(url).pipe(fs.createWriteStream(image_path));
  stream.on('finish', function () {
    applyPrimitiveBinary(image_path, transformed_image_path, callback)
  });
}

function applyPrimitiveBinary(image_path, transformed_image_path, callback) {
  var proc = child_process.spawn('./primitive', [ '-i', image_path, '-o', transformed_image_path, '-n', '100' ], { stdio: 'inherit' });
  proc.on('close', function(code) {
    if (code !== 0) {
      console.log('Error ocurrio transformando imagen.');
    } else {
      console.log('Imagen transformada exitosamente.');
    }
    callback();
  });
}
