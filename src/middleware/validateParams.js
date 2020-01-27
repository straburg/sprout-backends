import { errorResponse } from "../helpers";

module.exports = {
    validateUserParams: (req, res, next) => {
        const { userid } = req.params;
        let error;
        error = isNaN(userid) || userid <= 0 ? "User id should be a number" : error;
        error ? res.status(400).send(errorResponse(error)) : next();
    },
    validateAmount: (req, res, next) => {
        const { amount } = req.body;
        let error;
        error = isNaN(amount) || amount <= 0 ? "Amount should be a number" : error;
        error ? res.status(400).send(errorResponse(error)) : next();
    }
}