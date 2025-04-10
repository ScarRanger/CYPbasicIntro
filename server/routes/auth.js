const express = require("express");
const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();
const router = express.Router();

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
];

const auth = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:3000/oauth2callback"
);

router.get("/auth", (req, res) => {
    const url = auth.generateAuthUrl({ access_type: "offline", scope: SCOPES });
    res.redirect(url);
});

router.get("/oauth2callback", async (req, res) => {
    const { code } = req.query;
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    fs.writeFileSync("token.json", JSON.stringify(tokens));
    res.send("Authentication successful! You can close this tab.");
});

module.exports = router;
