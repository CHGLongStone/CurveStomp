const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 5000;
const app = express();
app.use(express.json({
    inflate: true,
    limit: '100kb',
    reviver: null,
    strict: true,
    type: 'application/json',
    verify: undefined
}));
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/assets'));
var http = require("http").Server(app);

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
