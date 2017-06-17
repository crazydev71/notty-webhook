import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as https from 'https';
import * as fs from  'fs';

import setRoutes from './routes';

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

const privateKey = fs.readFileSync(path.join(__dirname, '../../secure/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '../../secure/cert.pem'), 'utf8');

const credentials = {key: privateKey, cert: certificate};

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));
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

  /*app.listen(app.get('port'), () => {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
  });*/
  
  let httpsServer = https.createServer(credentials, app).listen(app.get('port'), () => {
  	console.log('HTTPS secure server is listening on port ' + app.get('port'));
  });
});

export { app };
