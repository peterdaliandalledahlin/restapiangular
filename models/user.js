const db = require('mongoose');

const userSchema = db.Schema({

    _id:                    db.Schema.Types.ObjectId,
    firstname:              { type: String, required: true },
    middlename:             { type: String },
    lastname:               { type: String, required: true },
    birthday:               { type: String, required: true },
    email:                  { type: String, required: true, unique: true},
    password:               { type: String, required: true },

    billing_addressline:    { type: String, required: true },
    billing_city:           { type: String, required: true },
    billing_zipcode:        { type: String, required: true },
    billing_country:        { type: String, required: true },

    delivery_addressline:   { type: String },
    delivery_city:          { type: String },
    delivery_zipcode:       { type: String },
    delivery_country:       { type: String,},
 
    created:                { type: Date, default: Date.now },
    modified:               { type: Date, default: Date.now }
    
});

module.exports = db.model("User", userSchema);

