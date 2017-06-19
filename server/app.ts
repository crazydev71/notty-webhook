import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as https from 'https';
import * as fs from  'fs';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as mongoStore from 'connect-mongo';
import {Strategy} from 'passport-local';

import User from './models/user';

import setRoutes from './routes';

const app = express();

// Configuration
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

const privateKey = fs.readFileSync(path.join(__dirname, '../../secure/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '../../secure/cert.pem'), 'utf8');

const credentials = {key: privateKey, cert: certificate};


// Middleware init
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
const MongoStore= mongoStore(session);
app.use(session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 1000*3600*24*2
    },
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      ttl: 2 * 24 * 60 * 60
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// passport config

passport.use(new Strategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', express.static(path.join(__dirname, '../public')));

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  setRoutes(app);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // Setting up Https Server
  let httpsServer = https.createServer(credentials, app).listen(app.get('port'), () => {
  	console.log('HTTPS secure server is listening on port ' + app.get('port'));
  });
});

export { app };
