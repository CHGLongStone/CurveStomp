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
                dbconn.query("select ID from country where iso_code=?", country, (err, results) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        resolve(results[0]['ID']);

                    } else {
                        dbconn.query('insert into country(iso_code)values(?)', country, (err, results) => {
                            if (err) throw err;
                            resolve(results.insertId);
                        });

                    }
                });

            } else {
                dbconn.query("select ID from country where name=?", country, (err, results) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        resolve(results[0]['ID']);

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

            dbconn.query("select ID from region where name=?", region, (err, results) => {
                if (err) throw err;
                if (results.length > 0) {
                    resolve(results[0]['ID']);

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
            dbconn.query("select ID from city where name=?", city, (err, results) => {
                if (err) throw err;
                if (results.length > 0) {
                    resolve(results[0]['ID']);

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
                'insert into household(identifier,passcode)values(?,?)',
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
                'insert into member(household_id,age,sex,alias,designator)values(?,?,?,?,?)',
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
                'insert into report(member_id,symptom_cough,symptom_breathing,' +
                'symptom_walking,symptom_appetite,symptom_diarrhea,symptom_muscle_pain,symptom_fatigue,' +
                'symptom_nose,symptom_throat,symptom_fever,symptom_headache,' +
                'symptom_dizziness,symptom_nausea,' +
                'symptom_chills,symptoms_general_pain,symptom_smell_loss,' +
                'transmission_trans_distance,transmission_trans_surface,' +
                'transmission_trans_human,results_lab_tested,results_lab_hospitalized,' +
                'results_lab_hospital_days,results_lab_hospital_icu,results_lab_recovered,' +
                'results_lab_ventilation,results_lab_oxygen,results_lab_symptoms,' +
                'results_lab_pneumonia,results_lab_antibodies)' +
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
    }
};


