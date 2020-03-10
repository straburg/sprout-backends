import bcrypt from "bcryptjs";
import { errorResponse } from "../helpers";

module.exports = {
    validateInputs : (req, res, next) => {
        console.log("validateInput");
        const { firstname,lastname,gender,country,address,occupation,status,email,password,phone,username } = req.body;

        let error;
        error = firstname.trim().length === 0 ? "firstname is required" : error ;
        error = lastname.trim().length === 0 ? "lastname is required" : error;
        error = gender.trim().length === 0 ? "Gender is required" : error;
        error = country.trim().length === 0 ? "Country is required" : error;
        error = address.trim().length === 0 ? "Address is required" : error;
        error = occupation.trim().length === 0 ? "Occupation is required" : error;
        error = status.trim().length === 0 ? "Status is required" : error;
        error = email.trim().length === 0 ? "Email is reqiured" : error;
        error = username.trim().length === 0 ? "Username is reqiured" : error;
        error = password.length === 0 ? "Password should be 6 character or longer" : error;
        error = phone.length < 9 ? "Invalid phone number" : error;
        error ? res.status(400).send(errorResponse(error)):  next();
    },
    validateEmailInputs : (req, res, next) => {
        console.log("validateEmailInputs");
        const { recipient, title} = req.body;

        let error;
        error = recipient.trim().length === 0 ? "recipient is required" : error ;
        error = title.trim().length === 0 ? "title is required" : error;
        error ? res.status(400).send(errorResponse(error)):  next();
    },
    validatePasswordInputs:(req, res, next) => {
        console.log("validatePasswordInputs");
        const { email, password, anewpassword, bnewpassword } = req.body;

        let error;
        error = email.trim() === "" ? "Email is reqiured" : error;
        error = password === "" ? "Old Password is required" : error;
        error = anewpassword === "" ? "New Password is required" : error;
        error = bnewpassword === "" ? "Retype New Password is required" : error;
        error = anewpassword !== bnewpassword ? "Password does not match" : error ;
        if(error) {
            res.status(400).send(errorResponse(error))
        }else {
            req.body.newpassword = bcrypt.hashSync(anewpassword, 8);
             next();
        }
    },
    validatePasswordInput:(req, res, next) => {
        console.log("validatePasswordInputs");
        const { newpassword } = req.body;
            req.body.newpassword = bcrypt.hashSync(newpassword, 8);
             next();
        }
    },
    validateLoginInput : (req, res, next) => {
        const { email, password } = req.body;
        let error;
        error = email.trim() === "" ? "Email is reqiured" : error;
        error = password === "" ? "Password is required" : error;
        error ? res.status(400).send(errorResponse(error)) : next();
    },
    validateStrings : (req, res, next) => {
        console.log("validateStrings");
        const { firstname,lastname,gender,country,email,password } = req.body;
        let validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        let error;
        error = firstname.length < 2 ?  "firstname too short" : error;
        error = lastname.length < 2 ?  "lastname too short" : error;
        error = password.length < 6 ?  "lastname too short" : error;
        error = !validEmail.test(email) ?  "Please enter valid email address" : error;

        if(error){ 
            res.status(400).send(errorResponse(error));
         }else{
            const fullname = `${firstname} ${lastname}`
            req.body.name = fullname.toLowerCase();
            req.body.password = bcrypt.hashSync(password, 8);
            next();
        }


    }
    
}