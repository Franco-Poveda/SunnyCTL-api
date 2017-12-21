"use strict";
/*requiring mongodb node modules */
const  mongodb=require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const assert = require('assert');
const MongoUrl='mongodb+srv://poving:3Ac\2k}:_$nv=/U=@cluster0-6mwft.mongodb.net/test';

module.exports.onConnect = (callback) => {	

	MongoClient.connect(MongoUrl, (err, db) => {
		assert.equal(null, err);
		callback(db,ObjectID);
	});
	
}