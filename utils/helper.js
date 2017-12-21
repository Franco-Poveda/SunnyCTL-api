/*
* Angular 2 CRUD application using Nodejs
* @autthor Shashank Tiwari
*/

'use strict';

var ObjectId = require('mongodb').ObjectID;

class Helper {

    constructor() {

        this.Mongodb = require("./db");
    }

    getToken(t, cb) {
        this.Mongodb.onConnect((db, ObjectID) => {
            db.collection('users').findOne({ active: true, token: t }, { _id: 1, name: 1}, ((err, found) => {
                (found) ? cb(found) : cb(null);
                console.log(found);
                db.close();
            }));
        });
    }

    getUserRegistry(id, cb) {
        this.Mongodb.onConnect((db, ObjectID) => {
            db.collection('register').find({ uid: new ObjectId(id) }).toArray((err, result) => {
                console.log(result);
                cb(result);

                db.close();
            });
        });
    }

    getPreferencies(cb) {
        this.Mongodb.onConnect((db, ObjectID) => {
            db.collection('preferencies').find({}).toArray((err, result) => {
                console.log(result);
                cb(result);

                db.close();
            });
        });
    }

    registerLogin(t) {
        this.Mongodb.onConnect((db, ObjectID) => {
            db.collection('users').findOne({ token: t }, { _id: 1, name: 1 }, ((err, found) => {
                var reg = {
                    uid: found._id,
                    name: found.name,
                    token: t,
                    time: new Date()
                }
                console.log(reg);

                db.collection('register').insertOne(reg, (err, result) => {

                    if (err) {
                        return console.log("error register");
                    }

                    db.close();
                });

            }));
        });
    }

    savePreferencies(p) {
        this.Mongodb.onConnect((db, ObjectID) => {

                db.collection('preferencies').insertOne(p, (err, result) => {

                    if (err) {
                        return console.log("error preferencies");
                    }

                    db.close();
                });
        });
    }

    getUsers(callback) {
        this.Mongodb.onConnect((db, ObjectID) => {
            db.collection('users').find().toArray((err, result) => {
                callback(result);
                db.close();
            });
        });
    }


    addUser(data, callback) {

        var response = {};

        delete data['_id'];

        console.log(data);

        this.Mongodb.onConnect((db, ObjectID) => {

            /* Checking if users Existsin DB starts */

            db.collection('users').findOne(data, function (err, result) {

                if (err) {

                    response.error = true;
                    response.isUserExists = false;
                    response.message = `Something went Wrong,try after sometime.`;
                    callback(response);

                } else {

                    if (result != null) {

                        response.error = true;
                        response.isUserExists = true;
                        response.message = `User already exists.`;

                        callback(response);

                    } else {

                        /* Inserting data into DB starts */

                        db.collection('users').insertOne(data, (err, result) => {

                            if (err) {
                                response.error = true;
                                response.isUserExists = false;
                                response.message = `Something went Wrong,try after sometime.`;
                            } else {
                                response.error = false;
                                response.isUserExists = false;
                                response.isUserAdded = true;
                                response.id = result.ops[0]._id;
                                response.message = `User added.`;
                            }

                            callback(response);
                        });

                        /* Inserting data into DB ends */

                    }
                }
            });

            /* Checking if users Existsin DB ends */
        });
    }



    removeUsers(userID, callback) {

        this.Mongodb.onConnect((db, ObjectID) => {

            db.collection('users').deleteOne(
                {
                    _id: new ObjectID(userID)
                },
                (err, results) => {
                    if (err) {
                        callback({
                            error: true
                        });
                    } else {
                        callback({
                            error: false
                        });
                    }
                }
            );

        });

    }

    updateUser(userID, data, callback) {
        console.log("update", data);

        this.Mongodb.onConnect((db, ObjectID) => {

            db.collection('users').updateOne(
                {
                    _id: new ObjectID(userID)
                },
                {
                    $set: {
                        name: data.name,
                        gender: data.gender,
                        country: data.country,
                        active: data.active,
                        token: data.token
                    }
                }, (err, results) => {


                    if (err) {
                        callback({
                            error: true
                        });
                    } else {
                        callback({
                            error: false
                        });
                    }

                }
            );
        });
    }
}

module.exports = new Helper();