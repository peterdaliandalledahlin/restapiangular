const db = require('mongoose');
const encrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


// unrestricted
exports.register = function(req, res) {
    
    User
        .find({ email: req.body.email })
        .exec()
        .then(function(user) {
            if(user.length > 0) {
                return res.status(400).json({
                    message: `A user with email address ${req.body.email} already exists.`,
                    statuscode: 400
                })
            }
            else {
                encrypt.hash(req.body.password, 10, function(error, hash) {
                    if(error) {
                        return res.status(500).json({ 
                            error: error,
                            message: ` ${req.body.email}`
                        });
                    }
                    else {
                        
                        let user = new User(
                            {

                                _id:            new db.Types.ObjectId,
                                firstname:              req.body.firstname,
                                middlename:             req.body.middlename,
                                lastname:               req.body.lastname,
                                birthday:               req.body.birthday,
                                email:                  req.body.email,
                                password:               hash,


                                billing_addressline:    req.body.billing_addressline,
                                billing_city:           req.body.billing_city,
                                billing_zipcode:        req.body.billing_zipcode,
                                billing_country:        req.body.billing_country,


                                delivery_addressline:    req.body.delivery_addressline,
                                delivery_city:           req.body.delivery_city,
                                delivery_zipcode:        req.body.delivery_zipcode,
                                delivery_country:        req.body.billing_country,

                            }
                        );

                        user
                            .save()
                            .then(function() {
                                res.status(201).json({
                                   message: `The user ${req.body.firstname} ${req.body.lastname} was created successfully.`,
                                   statuscode: 201,
                                   success: true 
                                })
                            })
                            .catch(function(error) {
                                res.status(500).json({
                                    message: `Failed to create user ${req.body.firstname} ${req.body.lastname}.`,
                                    statuscode: 500,
                                    success: false
                                })
                            })
                    }
                })
            }
        }) 
}

exports.login = function(req, res) {
    User
        .find({ email: req.body.email })
        .then(function(user) {
            if(user.length === 0) {
                return res.status(401).json({
                    message: "Email address or password is incorrect",
                    statuscode: 401,
                    success: false
                })
            } 
            else {
                encrypt.compare(req.body.password, user[0].password, function(error, result) {
                    if(error) {
                        return res.status(401).json({
                            message: "Email address or password is incorrect",
                            statuscode: 401,
                            success: false
                        })
                    }

                    if(result) {
                        const token = jwt.sign(
                            { id: user[0]._id, email: user[0].email },
                            process.env.PRIVATE_SECRET_KEY,
                            { expiresIn: "1h" }
                        )

                        return res.status(200).json({
                            message: "Authentication was successful",
                            success: true,
                            token: token,
                            id: user[0]._id,
                            email: user[0].email,
                            firstname: user[0].firstname,
                            lastname: user[0].lastname
                        })
                    }

                    return res.status(401).json({
                        message: "Email address or password is incorrect",
                        statuscode: 401,
                        success: false
                    })
                })
            }       
        })
}


// restricted
// exempel. localhost:3001/api/users/all
exports.getUsers = function(req, res) {

    User.find()              
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).json(error))    
        
}

// exempel. localhost:3001/api/users/5ce515ce2af81f1484a0d88b
exports.getUser = function(req, res) {

    User.findOne({ _id: req.params.id })              
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).json(error))

}
// exports.updateUser = function(req, res) {
//     User.updateOne({_id: req.params.id}, req.body)
//     .then((data) => {
//         if(!data) {return res.status(404).end()}
//         return res.status(200).json({
//             message: 'Användaren uppdaterades i databasen',
//             error: error
//         })
//     })
//     .catch((error) => {
//         res.status(500).json({
//             message: 'Användaren uppdaterades inte',
//             error: error
//         })
//     })
// }
exports.updateUser = function(req, res) {
    if( req.body.password.length > 0 ) {
        encrypt.hash(req.body.password, 10, function(error, hash) {
            if(error) {
                return res.status(500).json({
                    error: error,
                    message: "Error | failed to encrypt password"
                })
            }
            else {
                User
                .updateOne({ _id:req.params.id },
                {$set: {
                    firstname:              req.body.firstname,
                    middlename:             req.body.middlename,
                    lastname:               req.body.lastname,
                    birthday:               req.body.birthday,
                    email:                  req.body.email,
                    password:               hash,

                    billing_addressline:    req.body.billing_addressline,
                    billing_city:           req.body.billing_city,
                    billing_zipcode:        req.body.billing_zipcode,
                    billing_country:        req.body.billing_country,

                    delivery_addressline:   req.body.delivery_addressline,
                    delivery_city:          req.body.delivery_city,
                    delivery_zipcode:       req.body.delivery_zipcode,
                    delivery_country:       req.body.delivery_country

                }})
                .then( () => {
                    res.json({succes: true});
                })
                // .then((data) => {
                //     if(!data) {return res.status(404).end()}
                //     return res.status(200).json({
                //         message: 'Användaren uppdaterades i databasen',
                //         error: error
                //     })
                // })
                .catch(function(error, affected, resp) {

                })
                // .catch((error) => {
                //     res.status(500).json({
                //         message: 'Användaren uppdaterades inte',
                //         error: error
                //     })
                // })
            }
        });
    } else {
        User
        .updateOne({ _id:req.params.id },
        {$set: {
            firstname:              req.body.firstname,
            middlename:             req.body.middlename,
            lastname:               req.body.lastname,
            birthday:               req.body.birthday,
            email:                  req.body.email,

            billing_addressline:    req.body.billing_addressline,
            billing_city:           req.body.billing_city,
            billing_zipcode:        req.body.billing_zipcode,
            billing_country:        req.body.billing_country,

            delivery_addressline:   req.body.delivery_addressline,
            delivery_city:          req.body.delivery_city,
            delivery_zipcode:       req.body.delivery_zipcode,
            delivery_country:       req.body.delivery_country

        }})
        .then( () => {
            res.json({succes: true});
        })
        // .then((data) => {
        //     if(!data) {return res.status(404).end()}
        //     return res.status(200).json({
        //         message: 'Användaren uppdaterades i databasen',
        //         error: error
        //     })
        // })
        .catch(function(error, affected, resp) {
            console.log(error)
        })
        // .catch((error) => {
        //     res.status(500).json({
        //         message: 'Användaren uppdaterades INTE',
        //         error: error
        //     })
        // })
    }
}
exports.deleteUser = function(req, res) {}