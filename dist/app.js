"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var routes_1 = require("./routes");
var app = express();
exports.app = app;
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
var mongodbURI = process.env.DB_URI;
app.use(morgan('dev'));
mongoose.Promise = global.Promise;
var mongodb = mongoose.connect(mongodbURI, { useMongoClient: true });
mongodb
    .then(function (db) {
    console.log('Connected to MongoDB on', db.host + ':' + db.port);
    routes_1.default(app);
    if (!module.parent) {
        app.listen(app.get('port'), function () {
            console.log('sunnyCTL-UI service API running @ ' + app.get('port'));
        });
    }
})
    .catch(function (err) {
    console.error(err);
});
//# sourceMappingURL=app.js.map