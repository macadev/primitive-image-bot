var Twitter = require('twitter');
var config = require('./config.js');
var request = require('request');
var fs = require('fs');
var uuidv1 = require('uuid/v1');

var client = new Twitter(config);

function fetchImage(url, localPath) {
  # TODO: not using request lib properly. Check out docs.
  request.get(url, function(response) {
    console.log(response);
    if (response.statusCode === 200) {
      fs.write(localPath, response.body, function() {
        console.log("Descarge imagen exitosamente");
      });
    }
  });
}

client.stream('user', {}, function(stream) {
  stream.on('data', function(event) {
    // console.log(event);
    console.log(event && event.text);
    console.log(event.extended_entities.media);
    if (event.extended_entities && event.extended_entities.media) {
      for (let entity of event.extended_entities.media) {
        var url = entity.media_url_https;
	console.log(url);
	fetchImage(url, '/Users/danielmacario/appdelante/primitive-image-bot/images/' + uuidv1());
      }
    }
  });
  
  stream.on('error', function(error) {
    console.log(error);
  });
});
