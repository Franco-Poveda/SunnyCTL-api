/*
* Angular 2 CRUD application using Nodejs
* @autthor Shashank Tiwari
*/

'use strict';
var mqtt = require('mqtt')
var client = mqtt.connect({ port: 1883, host: 'sc.pov-ing.com', keepalive: 10000, username: 'sunctl', password: 'sunctl' });

const helper = require("./helper");

function authorise(req, res, next) {
    // Header: http://tools.ietf.org/html/rfc6750#section-2.1
    var headerToken = req.get('Authorization');
    if (headerToken) {
        var matches = headerToken.match(/Bearer\s(\S+)/);
        if (!matches) {
            return res.status(499).send({ status: 'token_required', response: 'no token was submitted.' });
        }
        headerToken = matches[1];
        req.bearerToken = headerToken;
        helper.getToken(headerToken, (found) => {
            if (found !== null) {
                req.user = found;
                next();
            }
            else {
                return res.status(499).send({ status: 'invalid_token', response: 'The access token provided is invalid.' });
            }

        });

    }
    else {
        res.status(417).send({ status: 'expectation_failed', response: 'Expected request-header fail.' });
    }
}

class Routes {

    constructor(app) {
        this.app = app;
    }


    /* creating app Routes starts */
    appRoutes() {
        this.app.get('/api/open', authorise, (request, response) => {
              client.publish('inTopic', 'ON');
            response.send({message: `Yo, ${request.user.name.split(' ')[0]}! wellcome.`});
            helper.registerLogin(request.bearerToken);
        });

        /* Route to get all users starts*/
        this.app.get('/api/users', (request, response) => {

            helper.getUsers((result) => {
                if (result) {
                    response.status(200).json({
                        users: result
                    });
                } else {
                    response.status(404).json({
                        message: `No usres found.`
                    });
                }
            });
        });
        /* Route to get all users ends*/


        /* Route to add new user starts*/
        this.app.post('/api/users/', (request, response) => {


            helper.addUser(request.body, (result) => {

                if (result.error) {

                    response.status(403).json({
                        error: true,
                        message: `Error.`
                    });

                } else {

                    helper.getUsers((result) => {
                        if (result) {
                            response.status(200).json({
                                error: false,
                                users: result
                            });
                        } else {
                            response.status(404).json({
                                error: true,
                                message: `No usres found.`
                            });
                        }
                    });
                };
            });
        });
        /* Route to add new user ends*/


        /* Route to delete user starts*/
        this.app.delete('/api/users/:id', (request, response) => {

            if (request.params.id && request.params.id != '') {

                helper.removeUsers(request.params.id, (result) => {

                    if (result.error) {

                        response.status(403).json({
                            error: true,
                            message: `Error.`
                        });

                    } else {

                        helper.getUsers((result) => {
                            if (result) {
                                response.status(200).json({
                                    error: false,
                                    users: result
                                });
                            } else {
                                response.status(404).json({
                                    error: true,
                                    message: `No usres found.`
                                });
                            }
                        });


                    };

                });

            } else {
                response.status(403).json({
                    error: true,
                    message: `Invalid user Id.`
                });
            }
        });
        /* Route to delete user ends*/


        /* Route to update user starts*/
        this.app.put('/api/users/:id', (request, response) => {


            if (request.params.id && request.params.id != '') {

                helper.updateUser(request.params.id, request.body, (result) => {

                    if (result.error) {

                        response.status(403).json({
                            error: true,
                            message: `Error.`
                        });

                    } else {


                        helper.getUsers((result) => {
                            if (result) {
                                response.status(200).json({
                                    error: false,
                                    users: result
                                });
                            } else {
                                response.status(404).json({
                                    error: true,
                                    message: `No usres found.`
                                });
                            }
                        });


                    };

                });

            } else {
                response.status(403).json({
                    error: true,
                    message: `Invalid user Id.`
                });
            }
        });
        /* Route to update user ends*/
        this.app.get('/api/users/:id/registry', (request, response) => {
            helper.getUserRegistry(request.params.id, (result) => {
                console.log(request.params.id);
                response.status(200).json({
                    error: false,
                    reg: result
                });
            });
        });
        /* Route to update user ends*/
        this.app.get('/api/preferencies', (request, response) => {
            helper.getPreferencies((result) => {
                console.log(request.params.id);
                response.status(200).json({
                    error: false,
                    reg: result
                });
            });
        });
        this.app.post('/api/preferencies', (request, response) => {
            var p = request.body;
            console.log(request.body);
            helper.savePreferencies(p, (result) => {
                response.status(200).json({
                    error: false,
                    reg: result
                });
            });
        });
    }


    routesConfig() {
        this.appRoutes();
    }
}
module.exports = Routes;