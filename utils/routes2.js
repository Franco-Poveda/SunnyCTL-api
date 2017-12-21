/*
* Angular 2 CRUD application using Nodejs
* @autthor Shashank Tiwari
*/

'use strict';
var jwt = require("jsonwebtoken");


let testUser = { username: 'test', password: 'test', firstName: 'Franco', lastName: 'Poveda' };

class Routes {

    constructor(app) {
        this.app = app;
        
    }


    /* creating app Routes starts */
    appRoutes() {
        this.app.post('/api/authenticate', (request, response) => {
            // get parameters from post request
            let params = request.body;
            console.log(params);

            // check user credentials and return jwt token if valid
            if (params.username === testUser.username && params.password === testUser.password) {
                var jwt_token = jwt.sign({ user: params.username }, '9anaskas9990asmkams'); // , { expiresIn: 10 } seconds

                response.send({
                    status: 200,  
                    token: jwt_token  
                  });
            }
            else {
                response.status(200).json({ status: 200});
            }
        });
    }


    routesConfig() {
        this.appRoutes();
    }
}
module.exports = Routes;