// Load the MySQL pool connection
const database = require('../data/config');
const {ValidationRules, validate} = require('../validator.js');

///////////////////////////////////////////////////////////////////////////////////////////////////
// EXECUTED SYNCHRONOUSLY BEFORE SERVER COMES UP
let max_hhid;
database.query('select max(uid) hhid from household')
    .then(results => {
        max_hhid = (results.length > 0) ? results[0].hhid : 0;
        console.log(`Using MAX HHID = ${max_hhid}`);
    })
    .catch(err => {
        console.log("Could not get MAX HHID from server.");
        throw err
    });

///////////////////////////////////////////////////////////////////////////////////////////////////

const router = app => {
    /////////// ESTABLISH DEPENDENCIES ////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////////////
    // TODO: How to support 'back' button?
    app.get('/?', (req, res) => {
        res.render('form');
    });

    app.post('/api/generate_id/?', (req, res) => {
        // TODO: Consider persisting max_hhid value for crash recovery?
        max_hhid++;
        console.log("[" + Date.now() + "]: " + max_hhid);
        res.send(max_hhid.toString());
    });

    app.post('/api/create_profile/?', ValidationRules.create_profile(), validate, (req, res) => {
        // TODO: If uid requested isn't between startup_maxhid and cur_maxhid, should it be honored?
        let sql; // container for SQL queries
        let vals;
        let scratchpad = {};

        // See if requested profile already exists
        database.query('select id from household where uid = ?', req.body.identity.unique_identifier)

            // Step 1. Insert household if not exists.
            .then(results => {
                if (results.length > 0) throw ("profile already exists.");

                sql = `insert into household (uid, sha2_256_pass, locale_id)
                       values (?, sha2(concat(uid, ?), 256), (select id from locale where code = ?))
                       on duplicate key update id = id`;
                vals = [
                    req.body.identity.unique_identifier,
                    req.body.identity.passcode,
                    "en-ca"
                ];
                return database.query(sql, vals);
            })

            // Step 2. Authenticate household. Abort on NULL (race condition)
            .then(results => {
                sql = `select id
                       from household
                       where uid = ?
                         and sha2_256_pass = sha2(concat(uid, ?), 256)`;
                vals = [ // TODO: Do we need to redefine this?
                    req.body.identity.unique_identifier,
                    req.body.identity.passcode
                ];
                return database.query(sql, vals);
            })

            // Step 3. Insert location if not exists (we have location information)
            .then(results => {
                if (results.length === 0) throw ("Profile Creation Failed.");
                scratchpad.household_id = results[0].id; // TODO: check if exists?

                sql = `insert into location (country, region, city, street_name, postal_code)
                       values (?, ?, ?, ?, ?)
                       on duplicate key update id = id`;
                vals = [
                    req.body.location.country,
                    req.body.location.region,
                    req.body.location.city,
                    req.body.location.street_name,
                    req.body.location.postal_code
                ];
                return database.query(sql, vals);
            })

            // Step 4. Link the household to the location (have household id)
            .then(results => {
                sql = `insert into household_location (household_id, location_id)
                       values (?, (select id
                                   from location
                                   where country = ?
                                     and region = ?
                                     and city = ?
                                     and street_name = ?
                                     and postal_code = ?))`;
                vals = [
                    scratchpad.household_id,
                    req.body.location.country,
                    req.body.location.region,
                    req.body.location.city,
                    req.body.location.street_name,
                    req.body.location.postal_code
                ];
                return database.query(sql, vals);
            })

            // Handle success
            .then(results => {
                console.log('Created Profile for: ' + req.body.identity.unique_identifier);
                res.json({response: 'Created profile' + req.body.identity.unique_identifier})
            })

            // Handle failure
            .catch(err => {
                console.log(err);
                res.status(400).json({response: "Creation Failed."})
            })
    });

    app.post('/api/submit_report/?', ValidationRules.submit_report(), validate, (req, res) => {
        let sql; // container for SQL queries
        let vals; // container for SQL variables
        let scratchpad = {}; // scratchpad for variables

        // Step 0. Authenticate user and grab household ID. Abort if NULL.
        sql = `select id
               from household
               where uid = ?
                 and sha2_256_pass = sha2(concat(uid, ?), 256)`;
        vals = [
            req.body.household.identity.unique_identifier,
            req.body.household.identity.passcode
        ];
        database.query(sql, vals)
            // Step 1. Add the member if not exists.
            .then(results => {
                if (results.length === 0) throw ("auth fail");

                scratchpad.household_id = results[0].id; // TODO: check if exists?
                sql = `insert into member (household_id, age, sex, alias)
                       values (?, ?, ?, ?)
                       on duplicate key update id = id`;
                vals = [
                    scratchpad.household_id,
                    req.body.report.age,
                    req.body.report.sex,
                    req.body.report.alias,
                ];
                return database.query(sql, vals)
            })

            // Step 2. File a report for the member (assume member exists)
            .then(results => {

                console.log(`Report : ${req.body}`);

                sql = `insert into report (member_id, symp_cough, symp_breathing, symp_walking,
                                           symp_appetite_loss, symp_diarrhea, symp_muscle_pain,
                                           symp_fatigue, symp_runny_nose, symp_sore_throat,
                                           symp_fever, symp_headache, symp_dizzy, symp_nausea,
                                           symp_shivers, symp_general_pain, symp_smell_loss,
                                           tran_distance, tran_surface, tran_human, lab_tested,
                                           lab_hospitalized, lab_days_in_hospital, lab_icu,
                                           lab_recovered, lab_ventilated, lab_oxygen, lab_pneumonia,
                                           lab_antibodies, lab_other_symps)
                       values ((select id
                                from member
                                where household_id = ?
                                  and age = ?
                                  and sex = ?
                                  and alias = ?),
                               ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                               ?, ?, ?, ?, ?, ?)`;
                vals = [
                    scratchpad.household_id,
                    req.body.report.age,
                    req.body.report.sex,
                    req.body.report.alias,
                    req.body.report.symptoms.m_symp_cough,
                    req.body.report.symptoms.m_symp_breathing,
                    req.body.report.symptoms.m_symp_walking,
                    req.body.report.symptoms.m_symp_appetite,
                    req.body.report.symptoms.m_symp_diarrhea,
                    req.body.report.symptoms.m_symp_muscle_pain,
                    req.body.report.symptoms.m_symp_fatigue,
                    req.body.report.symptoms.m_symp_nose,
                    req.body.report.symptoms.m_symp_throat,
                    req.body.report.symptoms.m_symp_fever,
                    req.body.report.symptoms.m_symp_headache,
                    req.body.report.symptoms.m_symp_dizziness,
                    req.body.report.symptoms.m_symp_nausea,
                    req.body.report.symptoms.m_symp_chills,
                    req.body.report.symptoms.m_symp_general_pain,
                    req.body.report.symptoms.m_symp_smell_loss,

                    req.body.report.transmission.m_trans_distance,
                    req.body.report.transmission.m_trans_surface,
                    req.body.report.transmission.m_trans_human,

                    req.body.report.lab_results.m_lab_tested,
                    req.body.report.lab_results.m_lab_hospitalized,
                    req.body.report.lab_results.m_lab_hosp_days,
                    req.body.report.lab_results.m_lab_hosp_icu,
                    req.body.report.lab_results.m_lab_recovered,
                    req.body.report.lab_results.m_lab_ventilation,
                    req.body.report.lab_results.m_lab_oxygen,
                    req.body.report.lab_results.m_lab_pneumonia,
                    req.body.report.lab_results.m_lab_antibodies,
                    req.body.report.lab_results.m_lab_symptoms
                ];
                return database.query(sql, vals)
            })

            // Step 3. Update location table
            .then(results => {
                // No point in delaying response:
                res.json({response: 'received report'});

                // But there's some maintenance to be done
                sql = `insert into location (country, region, city, street_name, postal_code)
                       values (?, ?, ?, ?, ?)
                       on duplicate key update id = id;`;
                vals = [
                    req.body.household.location.country,
                    req.body.household.location.region,
                    req.body.household.location.city,
                    req.body.household.location.street_name,
                    req.body.household.location.postal_code
                ];
                return database.query(sql, vals);
            })

            // Step 4. Update household_location table
            .then(results => {
                sql = `insert into household_location (household_id, location_id)
                       select ?, loc.id
                       from (select id
                             from location
                             where country = ?
                               and region = ?
                               and city = ?
                               and street_name = ?
                               and postal_code = ?) loc,
                            (select max(effective_ts) ts
                             from household_location
                             where household_id = ?) latest
                       where not exists(
                               select *
                               from household_location
                               where household_id = ?
                                 and location_id = loc.id
                                 and effective_ts = latest.ts
                           )`;
                vals = [
                    scratchpad.household_id,
                    req.body.household.location.country,
                    req.body.household.location.region,
                    req.body.household.location.city,
                    req.body.household.location.street_name,
                    req.body.household.location.postal_code,
                    scratchpad.household_id,
                    scratchpad.household_id
                ];

                return database.query(sql, vals)
            })

            // Handle success
            .then(results => {
                console.log('filed report for: ' + req.body.household.identity.unique_identifier);
            })

            // Handle failure
            .catch(err => {
                console.log(err);
                res.status(400).json({response: "Report Failed."})
            })
    });

    app.post('/api/get_profile/?', ValidationRules.get_profile(), validate, (req, res) => {
        let sql, vals;
        let scratchpad = {};
        let profile = {
            "household": {
                "identity": {
                    "unique_identifier": req.body.unique_identifier,
                    "passcode": req.body.passcode
                },
                "location": {
                    "country": '',
                    "region": '',
                    "city": '',
                    "street_name": '',
                    "postal_code": ''
                }
            },
            "members": {}
        };

        sql = `select id
               from household
               where uid = ?
                 and sha2_256_pass = sha2(concat(uid, ?), 256)`;
        vals = [
            req.body.unique_identifier,
            req.body.passcode
        ];
        database.query(sql, vals)

            // Step 1. Grab last known location. Abort if NULL. [ERROR]
            .then(results => {
                if (results.length === 0) throw ("auth fail");

                scratchpad.household_id = results[0].id;
                console.log(`Successful authentication for ${scratchpad.household_id}`);

                sql = `select l.*
                       from household_location hl,
                            location l
                       where hl.household_id = ?
                         and hl.effective_ts = (select max(effective_ts) ts
                                                from household_location
                                                where household_location.household_id = ?)
                         and hl.location_id = l.id;`;
                vals = [
                    scratchpad.household_id,
                    scratchpad.household_id
                ];
                return database.query(sql, vals)
            })

            // Step 2. Grab latest report for every household member (assume member has report)
            .then(results => {
                // There shouldn't be any profiles without locations....
                if (results.length === 0) throw ("DB Fail");

                profile.household.location.country = results[0].country;
                profile.household.location.region = results[0].region;
                profile.household.location.city = results[0].city;
                profile.household.location.street_name = results[0].street_name;
                profile.household.location.postal_code = results[0].postal_code;

                sql = `select r1.*
                       from (select concat(m.age, m.sex, '-', m.alias) desig,
                                    m.age,
                                    m.sex,
                                    m.alias,
                                    r.*
                             from member m,
                                  report r
                             where m.household_id = ?
                               and r.member_id = m.id) r1,
                            (select member_id, max(ts) as ts
                             from report
                             group by member_id) r2
                       where r1.member_id = r2.member_id
                         and r1.ts = r2.ts`;
                vals = [
                    scratchpad.household_id
                ];
                return database.query(sql, vals)
            })

            // Handle success
            .then(results => {
                for (let report of results) {
                    profile.members[report.desig] = {
                        age: report.age,
                        sex: report.sex,
                        alias: report.alias,
                        symptoms: {
                            'm_symp_cough': report.symp_cough,
                            'm_symp_fever': report.symp_fever,
                            'm_symp_fatigue': report.symp_fatigue,
                            'm_symp_nose': report.symp_runny_nose,
                            'm_symp_breathing': report.symp_breathing,
                            'm_symp_throat': report.symp_sore_throat,
                            'm_symp_headache': report.symp_headache,
                            'm_symp_walking': report.symp_walking,
                            'm_symp_appetite': report.symp_appetite_loss,
                            'm_symp_diarrhea': report.symp_diarrhea,
                            'm_symp_muscle_pain': report.symp_muscle_pain,
                            'm_symp_dizziness': report.symp_dizzy,
                            'm_symp_nausea': report.symp_nausea,
                            'm_symp_chills': report.symp_shivers,
                            'm_symp_general_pain': report.symp_general_pain,
                            'm_symp_smell_loss': report.symp_smell_loss
                        },
                        transmission: {
                            'm_trans_distance': report.tran_distance,
                            'm_trans_surface': report.tran_surface,
                            'm_trans_human': report.tran_human
                        },
                        lab_results: {
                            'm_lab_tested': report.lab_tested,
                            'm_lab_hospitalized': report.lab_hospitalized,
                            'm_lab_hosp_days': report.lab_days_in_hospital,
                            'm_lab_hosp_icu': report.lab_icu,
                            'm_lab_recovered': report.lab_recovered,
                            'm_lab_ventilation': report.lab_ventilated,
                            'm_lab_oxygen': report.lab_oxygen,
                            'm_lab_symptoms': report.lab_other_symps,
                            'm_lab_antibodies': report.lab_antibodies,
                            'm_lab_pneumonia': report.lab_pneumonia
                        }
                    }
                }
                console.log('Retrieved Profile for: ' + req.body.unique_identifier);
                res.json(profile)
            })

            // Handle failure
            .catch(err => {
                console.log(err);
                res.status(400).json({response: "Load Profile Failed."})
            })

    });

    app.post('/api/comm_fail/?', (req, res) => {
        logFmt(req.url, req.body);
        res.status(parseInt(req.body.ecode)).json({resp: 'here you go... '})
    });

    // Catch-all route
    app.all('*', (req, res) => {
        // TODO: This returns HTML to calls which may be expecting JSON, causing client-side
        //  failures. Can this be handled?
        res.redirect('/')
    });

};

module.exports = router;