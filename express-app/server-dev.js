const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const config = require('./config');
const mysqlinsert   = require('./mysqlinsertfunctions');
const countryjson = require('../countries');

var user_guid_value;
var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// ESTABLISH DATABASE CONNECTION
const dbconn = mysql.createConnection({
    host: "localhost",
    user: config.CurveStomp.user,
    password: config.CurveStomp.pass,
    database: config.CurveStomp.database,
    debug: false
});
dbconn.connect((err) => {
    if (err) throw err;
    console.log(" Db Connected!");
});

// CONFIGURE WEB SERVER
var http = require("http").Server(app);
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/assets'));

function isAuthenticated(req, res, next) {
    if (req.session.loggedin == true) {
        return next();
    } else {
        res.redirect('/homepage');
    }
}

// CONFIGURE UI ROUTING
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/form', (req, res) => {
    res.render('index');
});
app.get('/household', isAuthenticated, (req, res) => {
    var guid = req.session.uid;
    var firstpart = guid.slice(0, 3);
    var secondpart = guid.slice(3, 6);
    var thirdpart = guid.slice(6, 9);
    var hid = firstpart + "-" + secondpart + "-" + thirdpart;
    res.render('household', {guid: hid});
});
app.get('/form2', (req, res) => {
    res.render('form2');
});
app.get('/homepage/?', (req, res) => {
    res.render('homepage');
});

// CONFIGURE API ROUTING
// app.get('/gethouseholdid', (req, res) => {
//     var hid = Math.floor(Math.random() * 900000000) + 100000000;
//     dbconn.query('select household_guid from household where household_guid=?', [hid], (error, results) => {
//         if (error) throw error;
//         if (results.lenght == 0) {
//             res.send(hid.toString());
//         } else {
//             var hid = Math.floor(Math.random() * 900000000) + 100000000;
//             res.send(hid.toString());
//         }
//     });
// });
app.get('/countrylist', (req, res) => {
    res.send(countryjson);
});
app.post('/login', (req, res) => {
    var exidn = req.body.identity;
    var expass = req.body.pass;
    console.log(exidn);
    console.log(expass);
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
app.post(['/createhouseholdprofile', '/homepage/createhouseholdprofile'], (req, res) => {
    var huid = req.body.huid;
    console.log(req.body);
    var pass = req.body.pass;
    var country = req.body.country;
    var region = req.body.region;
    var city = req.body.city;
    var street = req.body.street_name;
    var postal_code = req.body.postal_code;
    req.session.loggedin = true;
    req.session.uid = huid;
    // request.session.username = username;
    res.redirect('/household');

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
    var usr_age = req.body.usr_age;
    var usr_gender = req.body.usr_gender;
    var usr_cough = req.body.usr_cough;
    var usr_cough_prod = req.body.usr_cough_prod;
    var usr_pneumonia = req.body.usr_pneumonia;
    var usr_breathing = req.body.usr_breathing;
    var usr_walking = req.body.usr_walking;
    var usr_appetite = req.body.usr_appetite;
    var usr_diarrhea = req.body.usr_diarrhea;
    var usr_musclepain = req.body.usr_musclepain;
    var usr_fatigue = req.body.usr_fatigue;
    var usr_nose = req.body.usr_nose;
    var usr_fever = req.body.usr_fever;
    var usr_headache = req.body.usr_headache;
    var usr_dizziness = req.body.usr_dizziness;
    var usr_nausea = req.body.usr_nausea;
    var usr_chills = req.body.usr_chills;
    var usr_gpain = req.body.usr_gpain;
    var usr_trans_isolation = req.body.usr_trans_isolation;
    var usr_trans_distance = req.body.usr_trans_distance;
    var usr_trans_surface = req.body.usr_trans_surface;
    var usr_trans_human = req.body.trans_human;

    console.log(req.body);
    dbconn.query('insert into household(household_guid) values(?)', [usridn], (err, res) => {
        if (err) throw err;
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


// TODO: REMOVE FROM PRODUCTION SERVER....

let max_hid = 0; // TODO: update max_hid on startup with largest PK in DB.

const cors = require('cors'); // TODO: Consider removing for production
app.use(cors({origin: '*'})); // TODO: Consider removing for production
app.use(express.json({
    inflate: true,
    limit: '100kb',
    reviver: null,
    strict: true,
    type: 'application/json',
    verify: undefined
}));

function logFmt(url, payload) {
    console.log('[' + Date.now() + '] Rx @ ' + url + ': ' + JSON.stringify(payload))
};

// HANDLE API REQUESTS
const {userValidationRules, validate} = require('./validator.js')
app.post('/api/commcheck/?', userValidationRules(), validate, (req, res) => {
    res.json(req.body);
}); // TODO: Delete for production

app.post('/api/get_profile/?', (req, res) => {
    logFmt(req.url, req.body);
    // TODO: validate received data
    res.json({
        "household": {
            "identity": {
                "unique_identifier": 123456789,
                "passcode": 'hellogoodbye'
            },
            "location": {
                "country": 'Canada',
                "region": "Ontario",
                "city": "Ottawa",
                "street_name": "Triangle St.",
                "postal_code": "M8C 7J9"
            }
        },
        "members": {
            "38M-JG": {
                "age": 38,
                "sex": "M",
                "alias": "JG"
            },
            "32F-VG": {
                "age": 32,
                "sex": "F",
                "alias": "VG"
            },
            "1M-UG": {
                "age": 1,
                "sex": "M",
                "alias": "UG"
            },
        }
    });
});
app.post('/api/submit_report/?', (req, res) => {
    logFmt(req.url, req.body);
    // TODO: Validate received data
    res.json(req.body);
});
app.post('/api/generate_id/?', (req, res) => {
    max_hid++;
    res.send(max_hid.toString());
});
app.post('/api/create_profile/?', async function (req, res) {
    console.log(req.body);
    var response = '';
    try {
        var identity = req.body.identity;
        var location = req.body.location;
        var uid = identity['unique_identifier'];
        var pass = identity['passcode'];
        var country = location['country'];
        var city = location['city'];
        var region = location['region'];
        var postal_code = location['postal_code'];
        var street_name = location['street_name'];
    } catch (error) {
        response += "Invalid Profile Request";
        res.json({'response': response});
        return;
    }

    if (uid == '' || uid == null) {
        response += "Empty household id";
    } else if (pass == '' || pass == null) {
        response += "Empty passcode";
    } else if (country == '' || country == null) {
        response += "Empty country";
    } else if (city == '' || city == null) {
        response += "Empty city";
    } else if (postal_code == '' || postal_code == null) {
        response += "Empty postal_code";
    } else if (street_name == '' || street_name == null) {
        response += "Empty postal code";
    } else 
    {
       var countryid    = await(mysqlinsert.country(country));
       var regionid     = await (mysqlinsert.region(region));
       var cityid       = await(mysqlinsert.city(city));
       var locationid   = await(mysqlinsert.location(countryid,regionid,cityid));
       var household_insert_id  = await(mysqlinsert.household(uid,pass));
       if(household_insert_id)
       {
        response += "ok";
       }
       else
       {
           response+="Profile Creation failed";
       }
       
    }

    console.log(response);
    res.json({'response': response});
    // logFmt(req.url, req.body);
    // TODO: validate data received

});



function addlocationdata(country,region,city)
{
    var country = addcountrydata

}


// FIRE UP SERVER
const PORT = 37248;
http.listen(PORT, function () {
    console.log('listening on port: ', PORT);
});