/**
 * A simple webserver using Node.js and express.js
 *
 * usage: `node testNode`
 */
var express = require('express'),
    app = module.exports = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/.'));  
});

// starts
var portNum = 3007;
app.listen(portNum);
console.log("Express server listening on port %d in %s mode", portNum, app.settings.env);
