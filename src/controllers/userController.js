import { dbServices, availableEmail, verifyEmail, clearTestDatas } from "../services/userServices";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
//import moment from "moment";
import { errorResponse, successResponse, today } from "../helpers";

module.exports = {
    test: (req = null, res) => {
        res.status(200).send(successResponse("welcome to scrib server"))
    },
    signup: (req, res) => {
        const { name,gender,country,address,occupation,status,email,password,phone,username,idcard,bank } = req.body;
        let arr = Math.floor(1000000000 + Math.random() * 9000000000);
        async function sendToDb() {
            try {

                let preparedQuery = "insert into users (name, gender, country,address,occupation,status, email, password, idcard, created_at, phone, acctnumber, username) values ($1,$2,$3,$4,$5,$6,$7,$8,$13,$9,$10,$11,$12,$13) RETURNING *";
                let queryParams = [name, gender, country, address,occupation,status, email, password, today(0, true),phone,arr,username,idcard,bank];
                let result = await dbServices(preparedQuery, queryParams);
                result = result[0];
                result.token = jwt.sign({ user: result }, "ourlittlesecret", {});
                //console.log(result);
                res.status(201).send(successResponse("Account created successfully", result));
            } catch (e) {
                res.status(406).send(errorResponse(e));
            }
        }
        sendToDb()
    },
    validateEmail: (req, res, next) => {
        const { email, userid } = req.body;
        async function validateUniqueEmail() {
            try {
                let preparedQuery = "select * from users where CASE WHEN $1::varchar IS NOT NULL THEN email = $1 ELSE 1=1 END  and CASE "
                    + " WHEN $2::int IS NOT NULL THEN id <> $2 ELSE 1=1 END";
                let queryParams = [email, userid];
                let emailValid = await availableEmail(preparedQuery, queryParams);
                next();
            } catch (e) {
                res.status(400).send(errorResponse(e));
            }
        }
        validateUniqueEmail();
    },
    validateUsername: (req, res, next) => {
        const { username, userid } = req.body;
        async function validateUniqueEmail() {
            try {
                let preparedQuery = "select * from users where CASE WHEN $1::varchar IS NOT NULL THEN username = $1 ELSE 1=1 END  and CASE "
                    + " WHEN $2::int IS NOT NULL THEN id <> $2 ELSE 1=1 END";
                let queryParams = [username, userid];
                let emailValid = await availableEmail(preparedQuery, queryParams);
                next();
            } catch (e) {
                res.status(400).send(errorResponse(e));
            }
        }
        validateUniqueEmail();
    },
    login: (req, res, next) => {
        const { email, password, bank } = req.body;
        async function loginUser() {
            try {
                let preparedQuery = "select * from users where email = $1 or username = $1";
                let queryParams = [email];
                let result = await verifyEmail(preparedQuery, queryParams);
                result = result[0];
                req.postedPassword = result.password;
                req.resultData = result;
                next();
            } catch (e) {
                res.status(401).send(errorResponse(e));
            }
        }
        loginUser();
    },
    verifyPassword: (req, res, next) => {
        const { postedPassword } = req;
        const { password } = req.body;
        let passwordIsValid = bcrypt.compareSync(password, postedPassword);
        passwordIsValid ? next() : res.status(401).send(errorResponse("Wrong username or password"));


    },
    createToken: (req, res) => {
        const { resultData } = req;
        resultData.token = jwt.sign({ user: resultData }, "ourlittlesecret", {});
        //console.log(resultData);
        resultData.token ?
            res.status(200).send(successResponse("Login successful", resultData))
            :
            res.status(401).send(errorResponse("Unauthorized"));
    },
    clearTestData: (req, res) => {
        async function clearTestDB() {
            try {
                let preparedQuery = "truncate table users restart identity";
                let clearTest = await clearTestDatas(preparedQuery);
                res.status(200).send(successResponse("Login successful", clearTest));
            } catch (e) {
                res.status(401).send(errorResponse(e));
            }
        }
        clearTestDB();

    },
    checkLastUpdate: (req, res, next) => {
        const { name, userid, email } = req.body;
        async function checkEdited() {
            try {
                let preparedQuery = "select * from users where  (name <> $1 or email <> $2) and  (id = $3 and edited_at > $4)";
                let queryParams = [name, email, userid, today(30, false)];
                await availableEmail(preparedQuery, queryParams);

                next();
            } catch (e) {
                res.status(408).send(errorResponse("You changed your name or email not too long ago, please try again after 30 days"));
            }
        }
        checkEdited();
    },

    updateProfile: (req, res) => {
        const { name, gender, country, email, password, userid, usercurrent: { currentName, currentEmail }, usertoken: { tokenName, tokenEmail } } = req.body;
        async function editProfile() {
            try {
                let preparedQuery = currentName === tokenName && currentEmail === tokenEmail ?
                    "update users set name = $1, gender = $2, country = $3, email = $4, password = $5 where id = $6 RETURNING *" :
                    "update users set name = $1, gender = $2, country = $3, email = $4, password = $5,edited_at = $7 where id = $6 RETURNING *";
                let queryParams = currentName === tokenName && currentEmail === tokenEmail ?
                    [name, gender, country, email, password, userid] :
                    [name, gender, country, email, password, userid, today(0, true)];

                let result = await dbServices(preparedQuery, queryParams);
                result = result[0];
                //console.log(result);
                res.status(200).send(successResponse("Profile updated successfully", result));
            } catch (e) {
                res.status(406).send(errorResponse(e));
            }

        }
        editProfile();
    },
    credit: (req, res) => {
        const { amount, bank } = req.body;
        const { userid } = req.params;
        async function editProfile() {
            try {
                let preparedQuery =  "update users set balance = $1, edited_at =$3 where id = $2 and bank = $4 RETURNING *" ;
                let queryParams = [amount, userid, today(0, true), bank ];

                let result = await dbServices(preparedQuery, queryParams);
                result = result[0];
                //console.log(result);
                res.status(200).send(successResponse("User credited successfully", result));
            } catch (e) {
                res.status(406).send(errorResponse(e));
            }

        }
        editProfile();
    },
    getUser: (req, res) => {
        const { userid } = req.params;

        async function getBook() {
            try {
                let preparedQuery = "select *  from users where id=$1";
                let queryParams = [userid];
                let result = await verifyEmail(preparedQuery, queryParams);
                result = result[0];
                res.status(200).send(successResponse("User data", result));
            } catch (e) {
                res.status(404).send(errorResponse("User not found"));
            }

        }
        getBook();
    },
    getBankUser: (req, res) => {
        const { bank } = req.params;

        async function getBook() {
            try {
                let preparedQuery = "select *  from users where bank=$1";
                let queryParams = [bank];
                let result = await verifyEmail(preparedQuery, queryParams);
                result = result[0];
                res.status(200).send(successResponse("User data", result));
            } catch (e) {
                res.status(404).send(errorResponse("User not found"));
            }

        }
        getBook();
    }
}