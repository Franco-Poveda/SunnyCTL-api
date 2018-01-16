import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as cors from 'cors';


import setRoutes from './routes';

const app = express();
dotenv.load();
app.set('port', (process.env.PORT || 3000));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let mongodbURI = process.env.DB_URI;

app.use(morgan('dev'));

// Load Balancer health check
app.use('/status', function (req, res, next) {
  res.writeHead(200, 'OK');
  res.end();
  next();
});

mongoose.Promise = global.Promise;
const mongodb = mongoose.connect(mongodbURI, { useMongoClient: true });

mongodb
  .then((db) => {
    console.log('Connected to MongoDB on', db.host + ':' + db.port);

    setRoutes(app);

    if (!module.parent) {
      app.listen(app.get('port'), () => {
        console.log('sunnyCTL-UI backend @ port: ' + app.get('port'));
      });
    }

  })
  .catch((err) => {
    console.error(err);
  });

export { app };