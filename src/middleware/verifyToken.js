import jwt from "jsonwebtoken";
import { errorResponse } from "../helpers";

module.exports = {
	checkForToken: function (req, res, next) { 
		const bearerHeader = req.headers["authorization"];
	if (typeof bearerHeader !== "undefined") {  
		const berarer = bearerHeader.split(" "); 
		const bearerToken = berarer[1]; 
		req.token = bearerToken;
        next();
    } else {
        res.status(403).send(errorResponse("Unauthorized. please login"));
     }
	},
	verifyToken: function (req, res, next) {
        const { token } = req;
        const { name, email } = req.body
        req.body.usercurrent = name && email  ? { currentName: name, currentEmail: email } : null;
		jwt.verify(token, "ourlittlesecret", function(err, data) {
            if (err) {
                res.status(403).send(errorResponse("Invalid or expired session. please login"));
            }else{
                const { user: { id, name, email } } = data;
                req.body.usertoken = { tokenName: name, tokenEmail: email }
                req.body.userid = id;
                next();
            }; 
        });
		
	}
}