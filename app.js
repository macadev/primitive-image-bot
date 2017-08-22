var Twitter = require('twitter');
var config = require('./config.js');
var uuidv1 = require('uuid/v1');

var fetcher = require('./image_fetcher.js');
var client = new Twitter(config);

client.stream('user', {}, function(stream) {
  stream.on('data', function(event) {
    // Imprimir mensaje del tweet
    console.log(event && event.text);
    // Imprimir lista de elementos de tipo 'media'
    console.log(event.extended_entities.media);
    if (event.extended_entities && event.extended_entities.media) {
      for (let entity of event.extended_entities.media) {
        var url = entity.media_url_https;
        // Obtener imagen del url y grabarla al disco usando 'fs'
        // le asignamos un nombre randomizado usando la libreria uuidv1
        fetcher.fetchImage(url, '/Users/danielmacario/appdelante/primitive-image-bot/images/' + uuidv1() + '.jpg');
      }
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
