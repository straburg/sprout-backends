import bcrypt from "bcryptjs";
import { errorResponse } from "../helpers";

module.exports = {
    validateInputs : (req, res, next) => {
        const { firstName,lastName,gender,country,address,occupation,status,email,password,phone } = req.body;

        let error;
        error = firstName.trim().length === 0 ? "Firstname is required" : error ;
        error = lastName.trim().length === 0 ? "Lastname is required" : error;
        error = gender.trim().length === 0 ? "Gender is required" : error;
        error = country.trim().length === 0 ? "Country is required" : error;
        error = address.trim().length === 0 ? "Address is required" : error;
        error = occupation.trim().length === 0 ? "Occupation is required" : error;
        error = status.trim().length === 0 ? "Status is required" : error;
        error = email.trim().length === 0 ? "Email is reqiured" : error;
        error = password.length === 0 ? "Password should be 6 character or longer" : error;
        error = phone.length < 9 ? "Invalid phone number" : error;
        error ? res.status(400).send(errorResponse(error)):  next();
    },
    validateLoginInput : (req, res, next) => {
        const { email, password } = req.body;
        let error;
        error = email.trim() === "" ? "Email is reqiured" : error;
        error = password === "" ? "Password is required" : error;
        error ? res.status(400).send(errorResponse(error)) : next();
    },
    validateStrings : (req, res, next) => {
        const { firstName,lastName,gender,country,email,password } = req.body;
        let validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        let error;
        error = firstName.length < 2 ?  "Firstname too short" : error;
        error = lastName.length < 2 ?  "Lastname too short" : error;
        error = password.length < 6 ?  "Lastname too short" : error;
        error = !validEmail.test(email) ?  "Please enter valid email address" : error;

        if(error){ 
            res.status(400).send(errorResponse(error));
         }else{
            const fullname = `${firstName} ${lastName}`
            req.body.name = fullname.toLowerCase();
            req.body.password = bcrypt.hashSync(password, 8);
            next();
        }


    }
    
}