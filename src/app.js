import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();
const prefix = "/api/v1";

routes(prefix, app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//App running
app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});

module.exports.app = app;