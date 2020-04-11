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
    maxid: function()
    {
        return new Promise((resolve,reject)=>{
            dbconn.query('select ID from household order by ID desc limit 1',(err,results)=>{
                if(err) throw err;
                resolve(results[0]['ID']);
            })

        })
        
    }
}