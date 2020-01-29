import express from "express";
import bodyParser from "body-parser";
import { signup, validateEmail, validateUsername, login, clearTestData, checkLastUpdate, updateProfile, test, verifyPassword, createToken, getUser,credit } from "../controllers/userController";
import { validateInputs, validateStrings, validateLoginInput } from "../middleware/validateInputs"
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
route.post("/signup", validateInputs, validateStrings, validateEmail, validateUsername, signup);
route.patch("/update/profile", checkForToken, validateInputs, validateStrings, verifyToken, validateEmail, checkLastUpdate, updateProfile);
route.patch("/credit/:userid", validateUserParams, validateAmount, credit);
route.post("/login", validateLoginInput, login, verifyPassword, createToken );
route.get("/user/:userid", validateUserParams, getUser)
route.delete("/cleartest",clearTestData);

export default route;
