const express       = require('express');
const session       = require('express-session');
const bodyParser    = require('body-parser');
const mysql         = require('mysql');
const path          = require('path');

var app     = express();
var http = require("http").Server(app);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.render('index');
});

const PORT = process.env.PORT || 5000;

// port to listen
http.listen(PORT, function(){
  console.log('listening on port: ', PORT);
});