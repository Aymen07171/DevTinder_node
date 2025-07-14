const validator = require('validator');


const validation = (req) => {

const {firstName ,lastName,emailId,age,password} = req.body;


    if (!firstName || !lastName) {
        
        throw new Error('First name and last name are required');
    }

    else if (!validator.isEmail(emailId)) {

        throw new Error('Email is not valid');

    }

    else if (!validator.isStrongPassword(password)) {

        throw new Error('Password must be at least 8 characters long and contain at least one letter, one number, and one symbol');
    }

    else if (!validator.isNumeric(age.toString())) {

        throw new Error('Age must be a number');
    }


}


module.exports = { validation }