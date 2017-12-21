/*
* Angular 2 CRUD application using Nodejs
* @autthor Shashank Tiwari
*/
'use strict';

const express = require("express");
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./utils/routes2');

class Server {

	constructor(){
		var that = this;
		this.port = 9898;
		this.host = `0.0.0.0`;
		this.app = express();
		this.uri = 'mongodb://localhost:27017';
		this.app.mongoose = mongoose.connect(this.uri, { useMongoClient: true })
		.then(function(db) {
			console.log("Connected to mongodb");
			that.initApp();
		})
		.catch(function (err) {
			console.error(err);
		});
	}

	initApp() {
		this.app.use(bodyParser.json());
		this.app.use(cors());
		this.routes = new routes(this.app);
		this.routes.routesConfig();
		this.app.listen(this.port, this.host, () => {
			console.log(`Listening on http://${this.host}:${this.port}`);
		});
	}
}

let app = new Server();