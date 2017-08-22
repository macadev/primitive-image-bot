var Twitter = require('twitter');
var config = require('./config.js');
var uuidv1 = require('uuid/v1');
var fs = require('fs');

var transformer = require('./image_transformer.js');
var client = new Twitter(config);

function uploadImage(transformed_image_path) {
  console.log("this far.");
  // Cargar imagen del disco a la memoria
  fs.readFile(transformed_image_path, function(err, data) {
    if (err) {
      console.log('Error reading transformed image.');
      throw err;
    }
    console.log("read file.");
    // Mandar un POST request al media endpoint
    client.post('media/upload', {media: data}, function(error, media, response) {
      console.log("sent post");
      if (!error) {
        // Si no hay error, el media object sera retornado en el callback
        console.log(media);

        // Mandemos un tweet con la imagen
        var status = {
          status: 'Imagen generada for Bot de Appdelante!',
          media_ids: media.media_id_string
        }

        client.post('statuses/update', status, function(error, tweet, response) {
          if (!error) {
            console.log('Tweet enviado exitosamente.');
            console.log(tweet);
          }
        });
      }
    });
  });
}

client.stream('user', {}, function(stream) {
  // Fix infinite loop because of my own tweets
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
        var random_name = uuidv1();
        var image_path = '/Users/danielmacario/appdelante/primitive-image-bot/images/' + random_name + '.jpg';
        var transformed_image_path = '/Users/danielmacario/appdelante/primitive-image-bot/images/' + random_name + '.out.jpg';
        transformer.transformImage(url, image_path, transformed_image_path, function() {
          uploadImage(transformed_image_path);
        });
      }
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
