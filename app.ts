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

/*let mongodbURI = 'mongodb://api01:EQqOBzTyw7lMmB6z@' +
  'cluster0-shard-00-00-6mwft.mongodb.net:27017,' +
  'cluster0-shard-00-01-6mwft.mongodb.net:27017,' +
  'cluster0-shard-00-02-6mwft.mongodb.net:27017/test' +
  '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'; */
  let mongodbURI = process.env.DB_URI;

app.use(morgan('dev'));

mongoose.Promise = global.Promise;
const mongodb = mongoose.connect(mongodbURI, { useMongoClient: true });

mongodb
  .then((db) => {
    console.log('Connected to MongoDB on', db.host + ':' + db.port);

    setRoutes(app);

    if (!module.parent) {
      app.listen(app.get('port'), () => {
        console.log('sunnyCTL-UI service API running @ ' + app.get('port'));
      });
    }

  })
  .catch((err) => {
    console.error(err);
});

export { app };