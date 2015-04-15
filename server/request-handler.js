var url = require('url');
var fs = require('fs');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "Content-Type": "application/json"
};

var messages = [];

exports.requestHandler = function(request, response) {

  var filename = url.parse(request.url).pathname || '/index.html';

  console.log("Serving request type " + request.method + " for url " + request.url);

  var validReqs = {
    'GET': 'get',
    'POST': 'post',
    'OPTIONS': 'options'
  };

  var statusCode = 200;

  if (validReqs[request.method]){

    var resultString = '';

    request.on("data",function(data) {
      resultString += data;
    });

    request.on("end", function() {
      if (request.method === "POST") {
        var message = JSON.parse(resultString);
        messages.push(message);
        statusCode = 201;
      }
      else if (!(request.method === "OPTIONS") && !(request.method === "GET")){
        statusCode = 404;
      }

      fs.readFile(filename, function(err, content){
        console.log(filename);
      });
      response.writeHead(statusCode, headers);

      var result = {"results": messages};
      response.end(JSON.stringify(result));
    });
  }

};

