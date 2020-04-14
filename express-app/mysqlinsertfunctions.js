const mysql = require('mysql');
const config = require('./config');

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
    console.log("[" + Date.now() + "]: " + " Db Connected!");
});

module.exports = {
    country: function addcountrydata(country) {
        return new Promise((resolve, reject) => {
            if (/^([A-Za-z]{3})$/.test(country)) {
                dbconn.query("select id from country where iso_code=?", country, (err, results) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        resolve(results[0]['id']);

                    } else {
                        dbconn.query('insert into country(iso_code)values(?)', country, (err, results) => {
                            if (err) throw err;
                            resolve(results.insertId);
                        });

                    }
                });

            } else {
                dbconn.query("select id from country where name=?", country, (err, results) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        resolve(results[0]['id']);

                    } else {
                        dbconn.query('insert into country(name)values(?)', country, (err, results) => {
                            if (err) throw err;
                            resolve(results.insertId);
                        });

                    }
                });
            }

        })


    },
    region: function addregion(region) {
        return new Promise((resolve, reject) => {

            dbconn.query("select id from region where name=?", region, (err, results) => {
                if (err) throw err;
                if (results.length > 0) {
                    resolve(results[0]['id']);

                } else {
                    dbconn.query('insert into region(name)values(?)', region, (err, results) => {
                        if (err) throw err;
                        resolve(results.insertId);
                    });

                }
            });

        })
    },
    city: function addcity(city) {
        return new Promise((resolve, reject) => {
            dbconn.query("select id from city where name=?", city, (err, results) => {
                if (err) throw err;
                if (results.length > 0) {
                    resolve(results[0]['id']);

                } else {
                    dbconn.query('insert into city(name)values(?)', city, (err, results) => {
                        if (err) throw err;
                        resolve(results.insertId);
                    });

                }
            });
        })


    },
    location: function (country, region, city, street_name, postal_code) {
        return new Promise((resolve, reject) => {
            dbconn.query('select id from location where country=? and region=? and city=? and street_name=? and postal_code=?',
                [country, region, city, street_name, postal_code], (err, results) => {
                    if (err) throw err;
                    console.log(results.length);
                    if (!results.length) {
                        resolve(null);


                    }
                else
                {
                    console.log("existing address");
                    resolve(results[0]['id']);
                   
                    
                }
            })
            
        })
    },
    newlocation: function(country,region,city,street_name,postal_code)
    {
        return new Promise((resolve,reject)=>{
            dbconn.query(
                'insert into location(country,region,city,street_name,postal_code)values(?,?,?,?,?)',
                [country, region, city, street_name, postal_code],
                (err, results) => {
                    if (err) throw err;
                    resolve(results.insertId);
                });
        })

    },
    household: function (uid, passcode) {
        return new Promise((resolve, reject) => {
            dbconn.query(
                'insert into household(uid,sha2_256_pass)values(?,?)',
                [uid, passcode],
                (err, results) => {
                    if (err) throw err;
                    resolve(results.insertId);
                })
        })
    },
    household_location: function (household, location) {
        return new Promise((resolve, reject) => {
            dbconn.query(
                'insert into household_location(household_id,location_id)values(?,?)',
                [household, location], (err, results) => {
                    if (err) throw err;
                    resolve("Profile Created");
                })
        })
    },
    member: function (household, age, sex, alias, designator) {
        return new Promise((resolve, reject) => {
            dbconn.query(
                'insert into member(household_id,age,sex,alias)values(?,?,?,?)',
                [household, age, sex, alias, designator], (err, results) => {
                    if (err) throw err;
                    resolve(results.insertId);
                })
        })
    },

    report: function (member, symp_cough, symp_breathing, symp_walking, symp_appetite,
        symp_diarrhea, symp_muscle_pain, symp_fatigue, symp_nose, symp_throat, symp_fever,
        symp_headache, symp_dizziness, symp_nausea, symp_chills, symp_general_pain,
        symp_smell_loss, trans_distance, trans_surface, trans_human,
        lab_tested, lab_hospitalized, lab_hosp_days, lab_hosp_icu, lab_recovered,
        lab_ventilation, lab_oxygen, lab_symptoms, lab_pneumonia, lab_antibodies) {
        return new Promise((resolve, reject) => {
            dbconn.query(
                'insert into report(member_id,symp_cough,symp_breathing,' +
                'symp_walking,symp_appetite_loss,symp_diarrhea,symp_muscle_pain,symp_fatigue,' +
                'symp_runny_nose,symp_sore_throat,symp_fever,symp_headache,' +
                'symp_dizzy,symp_nausea,' +
                'symp_shivers,symp_general_pain,symp_smell_loss,' +
                'tran_distance,tran_surface,' +
                'tran_human,lab_tested,lab_hospitalized,' +
                'lab_days_in_hospital,lab_icu,lab_recovered,' +
                'lab_ventilated,lab_oxygen,lab_other_symps,' +
                'lab_pneumonia,lab_antibodies)' +
                'values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [member, symp_cough, symp_breathing, symp_walking, symp_appetite,
                    symp_diarrhea, symp_muscle_pain, symp_fatigue, symp_nose, symp_throat, symp_fever,
                    symp_headache, symp_dizziness, symp_nausea, symp_chills, symp_general_pain,
                    symp_smell_loss, trans_distance, trans_surface, trans_human,
                    lab_tested, lab_hospitalized, lab_hosp_days, lab_hosp_icu, lab_recovered,
                    lab_ventilation, lab_oxygen, lab_symptoms, lab_pneumonia, lab_antibodies], (err, results) => {
                    if (err) throw err;
                    resolve(results.insertId);
                })
        })
    },
    location_check: function (identifier, country, city, region, pcode, street) {
        return new Promise((resolve, reject) => {
            dbconn.query('select  uid,country,city,region,street_name,postal_code,household.id from household ' +
                'join household_location hl on household.id = hl.household_id ' +
                'join location l on hl.location_id = l.id' +
                ' where uid=? and country=? and city=? and region=? and street_name=? and postal_code=?',
                [identifier, country, city, region, street, pcode], function (err, results) {
                    if (err) throw err;
                    if (!results.length) {
                        resolve(1);
                    } else {
                        console.log("Old Data");
                        resolve(2);

                    }
                })
        })

        
    },
    location_update: function(identifier,country,city,region,pcode,street)
    {
        return new Promise((resolve,reject)=>{
            var locationid;
            var householdid;
            console.log(street);
            console.log(pcode);
            dbconn.query('insert into location(country,region,city,street_name,postal_code)values(?,?,?,?,?)',
                [country, region, city, street, pcode], (err, results) => {
                    if (err) throw err;
                    locationid = results.insertId;
                })
            dbconn.query('select id from household where uid=?', identifier, (err, results) => {
                if (err) throw err;
                householdid = results[0]['id'];
                dbconn.query('insert into household_location(household_id,location_id)values(?,?)',
                    [householdid, locationid], (err, results) => {
                        if (err) throw err;
                        resolve("Location Updated");
                    })
            })
        })
    },
    household_location_insert : function(huid,locationid)
    {
        return new Promise((resolve,reject)=>{
            dbconn.query('select id from household where uid=?', huid, (err, results) => {
                if (err) throw err;
                householdid = results[0]['id'];
                dbconn.query('insert into household_location(household_id,location_id)values(?,?)',
                    [householdid, locationid], (err, results) => {
                        if (err) throw err;
                        resolve("Location Updated");
                    })
            })
        })
    },
    getlocationid: function(country,city,region,postal_code,street_name)
    {
        console.log(country);
        console.log(city);
        console.log(region);
        console.log(postal_code);
        return new Promise((resolve,reject)=>{
            dbconn.query('select id from location where country=? and city=? and region=? and postal_code=? and street_name=?',
                [country, city, region, postal_code, street_name], (err, results) => {
                    if (err) throw err;
                    resolve(results[0]['id']);

                })
        })
    }
};


