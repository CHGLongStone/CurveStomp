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
    console.log(" Db Connected!");
});
module.exports = {
    country: function addcountrydata(country) {
        return new Promise((resolve, reject) => {
            if (/^([A-Za-z]{3})$/.test(country)) {
                dbconn.query("select ID from country where iso_code=?", country, (err, results) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        resolve(results[0]['ID']);

                    }
                    else {
                        dbconn.query('insert into country(iso_code)values("' + country + '")', (err, results) => {
                            if (err) throw err;
                            resolve(results.insertId);
                        });

                    }
                });

            }
            else {
                dbconn.query("select ID from country where name=?", country, (err, results) => {
                    if (err) throw err;
                    if (results.length > 0) {
                        resolve(results[0]['ID']);

                    }
                    else {
                        dbconn.query('insert into country(name)values("' + country + '")', (err, results) => {
                            if (err) throw err;
                            resolve(results.insertId);
                        });

                    }
                });
            }

        })



    },

    //Function to add city for create profile
    city: function addcity(city) {
        return new Promise((resolve, reject) => {
            dbconn.query("select ID from city where name=?", city, (err, results) => {
                if (err) throw err;
                if (results.length > 0) {
                    resolve(results[0]['ID']);

                }
                else {
                    dbconn.query('insert into city(name)values("' + city + '")', (err, results) => {
                        if (err) throw err;
                        resolve(results.insertId);
                    });

                }
            });
        })


    },


    //Function to add region for create profile

    region: function addregion(region) {
        return new Promise((resolve, reject) => {

            dbconn.query("select ID from region where name=?", region, (err, results) => {
                if (err) throw err;
                if (results.length > 0) {
                    resolve(results[0]['ID']);

                }
                else {
                    dbconn.query('insert into region(name)values("' + region + '")', (err, results) => {
                        if (err) throw err;
                        resolve(results.insertId);
                    });

                }
            });

        })


    },
    location: function(country,region,city,street_name,postal_code)
    {
        return new Promise((resolve,reject)=>{
             dbconn.query('insert into location(country,region,city,street_name,postal_code)values("' + country + '", "' + region + '", "' + city + '", "' + street_name + '", "' + postal_code + '")',(err,results)=>{
            if(err) throw err;
            resolve(results.insertId);        
        });
        })
    },
    household: function(uid,passcode)
    {
        return new Promise((resolve,reject)=>{
            dbconn.query('insert into household(identifier,passcode)values("' + uid + '", "' + passcode + '")',(err,results)=>{
                if(err) throw err;
                resolve(results.insertId);
            })
        })
    },
    household_location: function(household,location)
    {
        return new Promise((resolve,reject)=>{
            dbconn.query('insert into household_location(household_id,location_id)values("' + household + '", "' + location + '")',(err,results)=>{
                if(err) throw err;
                resolve("Profile Created");
            })
        })
    }
    

}


