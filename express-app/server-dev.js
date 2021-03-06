const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const config = require('./config');
const mysqlinsert = require('./mysqlinsertfunctions');
const mysqlselect = require('./mysqlselectfunctions');

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
app.use(bodyParser.urlencoded({ extended: true }));
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
    console.log("[" + Date.now() + "]: " + url + ': ' + JSON.stringify(payload))
};

// HANDLE API REQUESTS
const { ValidationRules, validate } = require('./validator.js');

app.post('/api/get_profile/?', ValidationRules.get_profile(), validate, async function (req, res) {
    logFmt(req.url, req.body);
    var uid = req.body.unique_identifier;
    var passcode = req.body.passcode;
    var datajson = await (mysqlselect.login(uid, passcode));
    if (datajson == "No data Found") {
        console.log(datajson);
        res.status(404).json({ 'response': 'profile not found' });
    }
    else {
        console.log(datajson);
        res.json(datajson);
    }

    // TODO: Verify HHID:Pass match.

    // res.json({
    //     "household": {
    //         "identity": {
    //             "unique_identifier": 123456789,
    //             "passcode": 'hellogoodbye'
    //         },
    //         "location": {
    //             "country": 'Canada',
    //             "region": "Ontario",
    //             "city": "Ottawa",
    //             "street_name": "Triangle St.",
    //             "postal_code": "M8C 7J9"
    //         }
    //     },
    //     "members": {
    //         "38M-JG": {
    //             "age": 38,
    //             "sex": "M",
    //             "alias": "JG"
    //         },
    //         "32F-VG": {
    //             "age": 32,
    //             "sex": "F",
    //             "alias": "VG"
    //         },
    //         "1M-UG": {
    //             "age": 1,
    //             "sex": "M",
    //             "alias": "UG"
    //         },
    //     }
    // });
});
app.post('/api/submit_report/?', ValidationRules.submit_report(), validate, async function (req, res) {
    // logFmt(req.url, req.body);
    var huid = req.body.household.identity.unique_identifier;
    var passcode = req.body.household.identity.passcode;
    var country     = req.body.household.location.country;
    var city        = req.body.household.location.city;
    var region      = req.body.household.location.region;
    var street_name = req.body.household.street_name;
    var postal_code = req.body.household.postal_code;
    var age = req.body.report.age;
    var alias = req.body.report.alias;
    var sex = req.body.report.sex;
    var designator = (age + sex + '-' + alias).toString();
    var symp_cough = req.body.report.symptoms.m_symp_cough;
    var symp_fever = req.body.report.symptoms.m_symp_fever;
    var symp_nose = req.body.report.symptoms.m_symp_nose;
    var symp_fatigue = req.body.report.symptoms.m_symp_fatigue;
    var symp_breathing = req.body.report.symptoms.m_symp_breathing;
    var symp_throat = req.body.report.symptoms.m_symp_throat;
    var symp_headache = req.body.report.symptoms.m_symp_headache;
    var symp_walking = req.body.report.symptoms.m_symp_walking;
    var symp_appetite = req.body.report.symptoms.m_symp_appetite;
    var symp_diarrhea = req.body.report.symptoms.m_symp_diarrhea;
    var symp_muscle_pain = req.body.report.symptoms.m_symp_muscle_pain;
    var symp_dizziness = req.body.report.symptoms.m_symp_dizziness;
    var symp_nausea = req.body.report.symptoms.m_symp_nausea;
    var symp_chills = req.body.report.symptoms.m_symp_chills;
    var symp_general_pain = req.body.report.symptoms.m_symp_general_pain;
    var symp_smell_loss = req.body.report.symptoms.m_symp_smell_loss;
    var trans_distance = req.body.report.transmission.m_trans_distance;
    var trans_surface = req.body.report.transmission.m_trans_surface;
    var trans_human = req.body.report.transmission.m_trans_human;
    var lab_tested = req.body.report.lab_results.m_lab_tested;
    var lab_hospitalized = req.body.report.lab_results.m_lab_hospitalized;
    var lab_hosp_days = req.body.report.lab_results.m_lab_hosp_days;
    var lab_hosp_icu = req.body.report.lab_results.m_lab_hosp_icu;
    var lab_recovered = req.body.report.lab_results.m_lab_recovered;
    var lab_ventilation = req.body.report.lab_results.m_lab_ventilation;
    var lab_oxygen = req.body.report.lab_results.m_lab_oxygen;
    var lab_symptoms = req.body.report.lab_results.m_lab_symptoms;
    var lab_antibodies = req.body.report.lab_results.m_lab_antibodies;
    var lab_pneumonia = req.body.report.lab_results.m_lab_pneumonia;

    // TODO: Check if HHID matches passcode on every report. Halt if not-DONEEE
    // TODO: If an _authenticated_ report's location is different than stored, update stored.-DONEEEE

    var household_id = await (mysqlselect.householdid(huid, passcode));
    logFmt(req.url, household_id);
    if (household_id == null) {
        res.status(404).json({ 'response': 'profile not found' });

    }
    else {
        console.log("Verified Profile");
        console.log(req.body.household.location.street_name);
        var location_check  = await(mysqlinsert.location_check(huid,country,city,region,req.body.household.location.postal_code,req.body.household.location.street_name));
        console.log(location_check);
        if(location_check==1)
        {
            console.log("")
            var location_update = await(mysqlinsert.location_update(huid,country,city,region,req.body.household.location.postal_code,req.body.household.location.street_name));

        }
        else
        {
           var lid  = await(mysqlinsert.getlocationid(req.body.household.location.country,req.body.household.location.city,req.body.household.location.region,req.body.household.location.postal_code,req.body.household.location.street_name));
            var location_household  = await(mysqlinsert.household_location_insert(huid,lid));
        }
       
        var member = await (mysqlinsert.member(household_id, age, sex, alias, designator));
        var report = await (mysqlinsert.report(member, symp_cough, symp_breathing, symp_walking, symp_appetite,
            symp_diarrhea, symp_muscle_pain, symp_fatigue, symp_nose, symp_throat, symp_fever,
            symp_headache, symp_dizziness, symp_nausea, symp_chills, symp_general_pain,
            symp_smell_loss, trans_distance, trans_surface, trans_human,
            lab_tested, lab_hospitalized, lab_hosp_days, lab_hosp_icu, lab_recovered,
            lab_ventilation, lab_oxygen, lab_symptoms, lab_pneumonia, lab_antibodies));
        if (report != null) {
            res.json(req.body);
        } else {
            res.json({ 'response': "Report submission failed" });
        }


    }

});
app.post('/api/generate_id/?', (req, res) => {
    max_hid++;
    console.log("[" + Date.now() + "]: " + max_hid);
    // TODO: Store last created HHID somewhere, to avoid conflicts on restart?
    res.send(max_hid.toString());
});
app.post('/api/create_profile/?', ValidationRules.create_profile(), validate, async function (req, res) {

    console.log("[" + Date.now() + "]: " + req.body);

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
    var locationid;
    // TODO: Ensure that the household identifier didn't already exist. A UNQ constraint in DB?

    var locationexist = await (mysqlinsert.location(country, region, city, street_name, postal_code));
    if(locationexist==null)
    {
        console.log("Location does not exist");
        locationid  = await (mysqlinsert.newlocation(country, region, city, street_name, postal_code));
    }
    else
    {
                locationid  = locationexist;
    }
    var household_insert_id = await (mysqlinsert.household(uid, pass));
    var h_location = await (mysqlinsert.household_location(household_insert_id, locationid));
    console.log("[" + Date.now() + "]: " + h_location);

    if (household_insert_id) {
        response += "ok";
    } else {
        response += "Profile Creation failed";
    }

    console.log("[" + Date.now() + "]: " + response);
    res.json({ 'response': response });
    // logFmt(req.url, req.body);
});

app.post('/api/comm_fail/?', (req, res) => {
    logFmt(req.url, req.body);
    res.status(parseInt(req.body.ecode)).json({ resp: 'here you go... ' })
});

// FIRE UP SERVER
// Catch-all route
app.all('*', (req, res) => {
    // TODO: This returns HTML to calls which may be expecting JSON, causing client-side
    //  failures. Can this be handled?
    res.render('form')
});
const PORT = 37248;
http.listen(PORT, function () {
    console.log("[" + Date.now() + "]: " + 'listening on port: ', PORT);
});