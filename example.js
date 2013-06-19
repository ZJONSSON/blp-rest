// blp-rest (c) 2013 Sigurgeir Orn Jonsson (ziggy.jonsson.nyc@gmail.com) 
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
// http://creativecommons.org/licenses/by-nc-sa/3.0/
// Full Licence: http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode

var api = require("./index"),
	express = require("express"),
	clues = require("clues"),
    app = express();


function REST(req,res,next) {
   // Use first argument of the path as the function name
  var fn = req.param("fn");

  // Merge req.params into req.query
  Object.keys(req.params).forEach(function(key) {
  	req.query[key] = req.params[key];
  });

  return api(fn,req.query)
   .then(function(d) { res.end(JSON.stringify(d)); },
          function(d) { res.end(JSON.stringify(d)); });
};

app.get("/blp/:fn/:ticker/:field",REST);
app.get("/blp/:fn/:ticker",REST);
app.get("/blp/:fn",REST);

app.listen(3000);