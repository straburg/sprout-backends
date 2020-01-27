import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import cors from "cors";
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();
const prefix = "/api/v1";

routes(prefix, app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//App running
app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});

module.exports.app = app;