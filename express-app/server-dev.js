const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const config = require('config');

var app = express();

const dbconn = mysql.createConnection({
  host: "localhost",
  database: config.CurveStomp.database,
  user: config.CurveStomp.user,
  password: config.CurveStomp.pass
});

dbconn.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
var http = require("http").Server(app);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  res.render('home');
});
app.get('/form', (req, res) => {
  res.render('index');
});

app.get('/form2', (req, res) => {
  res.render('form2');
});
app.post('/report.symptom', (req, res) => {
  var user_guid = req.body.user_guid;
  var member_id = req.body.member_id;
  var dry_cough = req.body.dry_cough;
  var pneumonia = req.body.pneumonia;
  var difficulty_breathing = req.body.difficulty_breathing;
  var difficulty_walking = req.body.difficulty_walking;
  var appetite = req.body.appetite;
  var diarrhea = req.body.diarrhea;
  var muscle_ache = req.body.muscle_ache;
  var fatigue = req.body.fatigue;
  var runny_nose = req.body.runny_nose;
  var congestion = req.body.congestion;
  var sore_throat = req.body.sore_throat;
  var fever_c = req.body.fever_c;
  var headache = req.body.headache;
  var confusion_dizziness = req.body.confusion_dizziness;
  var nausea = req.body.nausea;
  var chills = req.body.chills;
  var other_pain = req.body.other_pain;
});

app.post('/report.testing', (req, res) => {
  var user_guid = req.body.user_guid;
  var tested = req.body.tested;
  var recovered = req.body.recovered;
  var hospitalized = req.body.hospitalized;
  var ventilation = req.body.ventilation;
  var oxygen = req.body.oxygen;
  var other_symptoms = req.body.other_symptoms;

});

app.post('/report.transmission', (req, res) => {
  var user_guid = req.body.user_guid;
  var travel_amount = req.body.travel_amount;
  var travel_distance = req.body.travel_distance;
  var hospitalized = req.body.hospitalized;
  var surface_touch = req.body.surface_touch;
  var number_of_regular_contacts = req.body.number_of_regular_contacts;

});

app.post('/register.user', (req, res) => {
  var user_guid = req.body.user_guid;
  var passcode = req.body.passcode;
  var user_guid_value = req.body.user_guid_value;
  var passcode_value = req.body.passcode_value;

});

app.post('/authenticate.user', (req, res) => {
  var user_guid = req.body.user_guid;
  var user_guid_value = req.body.user_guid_value;
  var passcode = req.body.passcode;
  var passcode_value = req.body.passcode_value;

});

app.post('/createuserprofile', (req, res) => {
  var usremail = req.body.usremail;
  var usridn = req.body.usridn;
  var usrpass = req.body.usrpass;
  var usr_total_mem = req.body.usr_total_mem;
  var usr_country = req.body.usr_country;
  var usr_region = req.body.usr_region;
  var usr_city = req.body.usr_city;
  var usr_street = req.body.usr_street;
  var usr_pcode = req.body.usr_pcode;


  res.send("Record Submitted");
});

app.post('/register.location', (req, res) => {
  var user_guid = req.body.user_guid;
  var user_guid_value = req.body.user_guid_value;
  var passcode = req.body.passcode;
  var passcode_value = req.body.passcode_value;

});
const PORT = 37248;

// port to listen
http.listen(PORT, function () {
  console.log('listening on port: ', PORT);
});