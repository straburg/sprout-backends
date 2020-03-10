import express from "express";
import bodyParser from "body-parser";
import { signup, validateEmail, validateUsername, login, clearTestData, checkLastUpdate, updateProfile, test, verifyPassword, createToken, getUser, credit, getBankUser, sendEmail, sendEmailNotice, updatepassword } from "../controllers/userController";
import { validateInputs, validatePasswordInputs, validateStrings, validateLoginInput, validateEmailInputs } from "../middleware/validateInputs"
import { validateUserParams,validateAmount } from "../middleware/validateParams";
import { checkForToken, verifyToken } from "../middleware/verifyToken";
const route = express.Router();

route.use(express.json());
route.use(bodyParser.urlencoded({ 
	extended: true }));//middleware
route.use(bodyParser.text({ type: "application/json" }));
route.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
	next();
});

route.get("/test", test);
route.post("/changepassword", validatePasswordInputs,login, verifyPassword, updatepassword );
route.post("/adminchangepassword",validatePasswordInput, updatepassword );
route.post("/signup", validateInputs, validateStrings, validateEmail, validateUsername, signup, sendEmail);
route.post("/notify", validateEmailInputs, sendEmailNotice);
route.patch("/update/profile", checkForToken, validateInputs, validateStrings, verifyToken, validateEmail, checkLastUpdate, updateProfile);
route.patch("/credit/:userid", validateUserParams, validateAmount, credit);
route.post("/login", validateLoginInput, login, verifyPassword, createToken );
route.get("/user/:userid", validateUserParams, getUser);
route.get("/bankuser/:bank", getBankUser);
route.delete("/cleartest",clearTestData);

export default route;
