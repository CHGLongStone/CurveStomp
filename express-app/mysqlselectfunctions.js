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
    maxid: function () {
        return new Promise((resolve, reject) => {
            dbconn.query('select max(identifier) from household', (err, results) => {
                if (err) throw err;
                resolve(results[0]['max(identifier)']);
            })

        })

    },
    householdid: function (huid) {
        return new Promise((resolve, reject) => {
            dbconn.query('select ID from household where identifier=?', huid, (err, results) => {
                if (err) throw err;
                resolve(results[0]['ID']);
            });
        })
    },
    login: function (uid, passcode) {
        var household = {};
        var location = {};
        var members = {};
        var data = {};
        var identity = {};
        return new Promise((resolve, reject) => {
            dbconn.query('select household.identifier HHID,sha2(household.passcode, 256) PASS_sha2_256,' +
                'country.name country,region.name region,city.name city,' +
                'location.street_name street,location.postal_code p_code,' +
                'member.age age,member.sex sex,member.alias alias,' +
                'report.* from city,country,household,' +
                'household_location,location,region,report,' +
                'member where household_location.household_id = household.ID ' +
                'and household_location.location_id = location.ID ' +
                'and country.ID = location.country and region.ID = location.region ' +
                'and city.ID = location.city and report.member_id = member.ID ' +
                'and member.household_id = household.ID ' +
                'and household.identifier=? and passcode=?' +
                'order by HHID,report.member_id,report.timestamp_utc ASC'
                , [uid, passcode], (err, results) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        identity['unique_identifier'] = results[0]['HHID'];
                        identity['passcode'] = results[0]['passcode'];
                        location['country'] = results[0]['country'];
                        location['region'] = results[0]['region'];
                        location['city'] = results[0]['city'];
                        location['street_name'] = results[0]['street'];
                        location['postal_code'] = results[0]['p_code'];
                        household['identity'] = identity;
                        household['location'] = location;
                        for (var i = 0; i < results.length; i++) {
                            var designator = results[i]['age'] + results[i]['sex'] + '-' + results[i]['alias'];
                            var designatordata  = {};
                            designatordata['age'] = results[i]['age'];
                            designatordata['sex'] = results[i]['sex'];
                            designatordata['alias'] = results[i]['alias'];
                            members[designator] = designatordata;
                        }
                        data['household']   = household;
                        data['members'] = members;
                        resolve(data);
                    }
                    else
                    {
                        resolve("No data Found");
                    }
                })
        })
    }
}