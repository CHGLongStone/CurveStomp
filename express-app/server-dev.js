const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const config = require('./config');
const countryjson = require('../countries');
var user_guid_value;
var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const dbconn = mysql.createConnection({
  host: "localhost",
  database: config.CurveStomp.database,
  user: config.CurveStomp.user,
  password: config.CurveStomp.pass
});

dbconn.connect(function (err) {
  if (err) throw err;
  console.log(" Db Connected!");
});
var http = require("http").Server(app);
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
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

app.get('/household', isAuthenticated,(req,res)=>{
  var guid  = req.session.uid;
  var firstpart   = guid.slice(0,3);
  var secondpart  = guid.slice(3,6);
  var thirdpart   = guid.slice(6,9);
  var hid = firstpart+"-"+secondpart+"-"+thirdpart;
  res.render('household',{guid:hid});
})

app.post('/login',function(req,res){
  var exidn   = req.body.identity;
  var expass  = req.body.pass;
  console.log(exidn);
  console.log(expass);
});
app.get('/form2', (req, res) => {
  res.render('form2');
});
app.get('/homepage',(req,res)=>{
  res.render('homepage');
})

app.get('/homepage/',(req,res)=>{
  res.render('homepage');
})

app.get('/gethouseholdid',(req,res)=>{
 var hid  = Math.floor(Math.random() * 900000000) + 100000000;
  dbconn.query('select household_guid from household where household_guid=?',hid,(error,results)=>{
    if(error) throw error;
    if(results.lenght==0)
    {
      res.send(hid.toString());
      

    }
    else
    {
      var hid  = Math.floor(Math.random() * 900000000) + 100000000;
      res.send(hid.toString());

    }
  });
 
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

app.post(['/createhouseholdprofile', '/homepage/createhouseholdprofile'],(request,response)=>{
  var huid  = request.body.huid;
  console.log(request.body);
  var pass  = request.body.pass;
  var country = request.body.country;
  var region  = request.body.region;
  var city    = request.body.city;
  var street  = request.body.street_name;
  var postal_code = request.body.postal_code;
  request.session.loggedin = true;
  request.session.uid = huid;
  // request.session.username = username;
  response.redirect('/household');
 
})
app.get('/countrylist',(req,res)=>{
  res.send(countryjson);
})

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
  var usr_age   = req.body.usr_age;
  var usr_gender  = req.body.usr_gender;
  var usr_cough   = req.body.usr_cough;
  var usr_cough_prod  = req.body.usr_cough_prod;
  var usr_pneumonia   = req.body.usr_pneumonia;
  var usr_breathing   = req.body.usr_breathing;
  var usr_walking     = req.body.usr_walking;
  var usr_appetite    = req.body.usr_appetite;
  var usr_diarrhea    = req.body.usr_diarrhea;
  var usr_musclepain  = req.body.usr_musclepain;
  var usr_fatigue     = req.body.usr_fatigue;
  var usr_nose        = req.body.usr_nose;
  var usr_fever       = req.body.usr_fever;
  var usr_headache    = req.body.usr_headache;
  var usr_dizziness   = req.body.usr_dizziness;
  var usr_nausea      = req.body.usr_nausea;
  var usr_chills      = req.body.usr_chills;
  var usr_gpain       = req.body.usr_gpain;
  var usr_trans_isolation   = req.body.usr_trans_isolation;
  var usr_trans_distance    = req.body.usr_trans_distance;
  var usr_trans_surface     = req.body.usr_trans_surface;
  var usr_trans_human       = req.body.trans_human;

  console.log(req.body);
  dbconn.query('insert into household(household_guid) values("' + usridn + '")',(err,res)=>{
    if(err) throw err;
    var rowid = res.insertId;
  });


  res.send("Record Submitted");
});

app.post('/register.location', (req, res) => {
  var user_guid = req.body.user_guid;
  var user_guid_value = req.body.user_guid_value;
  var passcode = req.body.passcode;
  var passcode_value = req.body.passcode_value;

});

function isAuthenticated(req, res, next) {
	if (req.session.loggedin == true) {
		return next();
	}
	else {
		res.redirect('/homepage');
	}
}
const PORT = 37248;

// port to listen
http.listen(PORT, function () {
  console.log('listening on port: ', PORT);
});