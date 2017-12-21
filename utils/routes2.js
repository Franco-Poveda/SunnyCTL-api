/*
* Angular 2 CRUD application using Nodejs
* @autthor Shashank Tiwari
*/

'use strict';
var jwt = require("jsonwebtoken");
var User = require('../models/user');


class Routes {

  constructor(app) {
    this.app = app;
  }

  /* creating app Routes starts */
  appRoutes() {

    this.app.post('/api/authenticate', (request, response) => {
      // get parameters from post request
      let params = request.body;
      User.findOne({
        email: params.email
      }, function(err, user) {
        if (err)
        {
          res.send({
            success: false,
            message: 'dbError'
          });
        }
        else if (!user) {
          res.send({
            success: false,
            message: 'userNotFound'
          });
        } else {
          // Check if password matches
          user.comparePassword(params.password, function(err, isMatch) {
            if (isMatch && !err) {
              // Create token if the password matched and no error was thrown
              var token = jwt.sign({user: params.email},  '9anaskas9990asmkams');
              res.json({
                success: true,
                data: user,
                message: 'authSuccess',
                token: token
              });
            } else {
              res.send({
                success: false,
                message: 'passwordMismatch'
              });
            }
          });
        }
      });
    });
  }


  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;