/*
* Angular 2 CRUD application using Nodejs
* @autthor Shashank Tiwari
*/
'use strict';

const express = require("express");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./utils/routes2');

class Server{

	constructor(){
		this.port = 9898;
		this.host = `0.0.0.0`;
		this.app = express();
 this.mongodb = mongoose.connect('mongodb://localhost:27017', { useMongoClient: true });
this.mongodb
    .then(function (db) {
		console.error("connected to mongodb");

	})
    .catch(function (err) {
    console.error(err);
});
	}

	appConfig(){
		this.app.use(bodyParser.json());
		this.app.use(
			cors()
		);
		
	}

	/* Including app Routes starts*/
	includeRoutes(){
		new routes(this.app).routesConfig();
	}
	/* Including app Routes ends*/	

	appExecute(){

		this.appConfig();
		this.includeRoutes();

		this.app.listen(this.port, this.host, () => {
			console.log(`Listening on http://${this.host}:${this.port}`);
		});
	}
}

const app = new Server();
app.appExecute();