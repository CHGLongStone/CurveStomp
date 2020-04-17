const express = require('express');
const port = 37248;
const app = express();
app.use(express.json({
    inflate: true,
    limit: '100kb',
    reviver: null,
    strict: true,
    type: 'application/json',
    verify: undefined
}));

///////////////////////////////////////////////////////////////////////////////////

const routes = require('./routes/routes');
routes(app);

///////////////////////////////////////////////////////////////////////////////////
// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});


/**********************************************************************************/

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


function logFmt(url, payload) {
    console.log("[" + Date.now() + "]: " + url + ': ' + JSON.stringify(payload))
};

// HANDLE API REQUESTS
const {ValidationRules, validate} = require('./validator.js');


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