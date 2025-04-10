const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const dorenv = require("dotenv").config();

const router = express.Router();
const SHEET_ID = process.env.SHEET_ID;
const TOKEN_PATH = path.join(__dirname, "token.json");
const MAX_MALE = 40;
const MAX_FEMALE = 40;

if (!fs.existsSync(TOKEN_PATH)) {
    console.error("❌ token.json not found. Please authenticate via /auth first.");
}

const oAuth2Client = new google.auth.OAuth2();
oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));

router.get("/", async (req, res) => {
    try {
        const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: "main!D2:D",
        });

        const rows = readRes.data.values || [];
        const males = rows.filter(row => row[0]?.toLowerCase() === "male").length;
        const females = rows.filter(row => row[0]?.toLowerCase() === "female").length;

        res.json({
            remainingMale: Math.max(0, MAX_MALE - males),
            remainingFemale: Math.max(0, MAX_FEMALE - females),
        });

    } catch (err) {
        console.error("❌ Error in /availability:", err.message);
        res.status(500).json({ error: "Availability check failed" });
    }
});

const app = express();
app.use("/", router);

module.exports = app;
