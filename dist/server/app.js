"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var https = require("https");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
var mongoStore = require("connect-mongo");
var httpsRedirect = require("express-https-redirect");
var passport_local_1 = require("passport-local");
var user_1 = require("./models/user");
var routes_1 = require("./routes");
var app = express();
exports.app = app;
// Configuration
dotenv.load({ path: '.env' });
// app.set('port', (process.env.PORT || 3000));
var privateKey = fs.readFileSync(path.join(__dirname, '../../secure/key.pem'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, '../../secure/cert.pem'), 'utf8');
var credentials = { key: privateKey, cert: certificate };
// Middleware init
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var MongoStore = mongoStore(session);
app.use(session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000
    },
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        ttl: 2 * 24 * 60 * 60
    })
}));
app.use(passport.initialize());
app.use(passport.session());
// passport config
passport.use(new passport_local_1.Strategy(user_1.default.authenticate()));
passport.serializeUser(user_1.default.serializeUser());
passport.deserializeUser(user_1.default.deserializeUser());
app.use('/', httpsRedirect(true));
app.use('/', express.static(path.join(__dirname, '../public')));
// MongoDB connect
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
    routes_1.default(app);
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    /*let httpServer = http.createServer(app).listen(app.get('port'), () => {
      console.log('HTTP server is listening on port ' + app.get('port'));
    });*/
    var httpPort = process.env.PORT_HTTP || 80;
    app.listen(httpPort, function () {
        console.log('HTTP server is listening on port ' + httpPort);
    });
    // Setting up Https Server
    var httpsPort = process.env.PORT_HTTPS || 443;
    var httpsServer = https.createServer(credentials, app).listen(httpsPort, function () {
        console.log('HTTPS secure server is listening on port ' + httpsPort);
    });
});
//# sourceMappingURL=app.js.map