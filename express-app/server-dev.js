const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const config = require('./config');
const mysqlinsert = require('./mysqlinsertfunctions');
const mysqlselect = require('./mysqlselectfunctions');
const countryjson = require('../countries');

var user_guid_value;
var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// CONFIGURE WEB SERVER
var http = require("http").Server(app);
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/assets'));

// CONFIGURE UI ROUTING
// TODO: How to support 'back' button?
app.get('/?', (req, res) => {
    res.render('form');
});


let max_hid = 0;

async function maxid() {
    max_hid = await (mysqlselect.maxid());
}

maxid();
// const cors = require('cors'); // TODO: Consider removing for production
// app.use(cors({origin: '*'})); // TODO: Consider removing for production
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
const {ValidationRules, validate} = require('./validator.js');
app.post('/api/get_profile/?', ValidationRules.get_profile(), validate, (req, res) => {
    logFmt(req.url, req.body);
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
app.post('/api/submit_report/?', ValidationRules.submit_report(), validate, (req, res) => {
    // logFmt(req.url, req.body);
    var huid = req.body.household.identity.unique_identifier;
    res.json(req.body);
});
app.post('/api/generate_id/?', (req, res) => {
    max_hid++;
    console.log(max_hid);
    res.send(max_hid.toString());
});
app.post('/api/create_profile/?', ValidationRules.create_profile(), validate, async function (req, res) {

    console.log(req.body);

    var response = '';
    var identity = req.body.identity;
    var location = req.body.location;
    var uid = identity['unique_identifier'];
    var pass = identity['passcode'];
    var country = location['country'];
    var city = location['city'];
    var region = location['region'];
    var postal_code = location['postal_code'];
    var street_name = location['street_name'];
    var countryid = await (mysqlinsert.country(country));
    var regionid = await (mysqlinsert.region(region));
    var cityid = await (mysqlinsert.city(city));
    var locationid = await (mysqlinsert.location(countryid, regionid, cityid, street_name, postal_code));
    var household_insert_id = await (mysqlinsert.household(uid, pass));
    var h_location = await (mysqlinsert.household_location(household_insert_id, locationid));
    console.log(h_location);

    if (household_insert_id) {
        response += "ok";
    } else {
        response += "Profile Creation failed";
    }

    console.log(response);
    res.json({'response': response});
    // logFmt(req.url, req.body);
});

// FIRE UP SERVER
const PORT = 37248;
http.listen(PORT, function () {
    console.log('listening on port: ', PORT);
});