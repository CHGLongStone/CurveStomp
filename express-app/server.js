const express       = require('express');
const session       = require('express-session');
const bodyParser    = require('body-parser');
const mysql         = require('mysql');
const path          = require('path');

var app     = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.render('index');
});

app.listen(5500);