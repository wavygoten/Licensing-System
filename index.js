require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 9000;
const router = require("./routes/route");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(router);

app.listen(port, () => console.info(`Listening on port ${port}`));
