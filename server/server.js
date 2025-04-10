const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const submitRoute = require("./routes/submit");
const availabilityRoute = require("./routes/availability");
const authRoute = require("./routes/auth");

app.use("/submit", submitRoute);
app.use("/availability", availabilityRoute);
app.use("/", authRoute);
app.use("/form", express.static(path.join(__dirname, "../public/forms")));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
app.use(express.static(path.join(__dirname, "../public/home")));