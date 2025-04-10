const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

if (!process.env.CLIENT_ID) {
    require("dotenv").config();
}

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const TOKEN_PATH = path.join(__dirname, "token.json");

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).send("Method Not Allowed");
    }

    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const pathname = urlObj.pathname;

    if (pathname === "/api/auth") {
        // 👇 Start OAuth flow
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: [
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/spreadsheets",
            ],
            prompt: "consent",
        });

        res.writeHead(302, { Location: authUrl });
        res.end();
    } else if (pathname === "/api/auth/callback") {
        // 👇 Handle OAuth callback
        const code = urlObj.searchParams.get("code");

        if (!code) {
            return res.status(400).send("No authorization code provided.");
        }

        try {
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);

            fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
            console.log("✅ Tokens saved to", TOKEN_PATH);

            res.setHeader("Content-Type", "text/html");
            res.status(200).send(`<h1>✅ Authentication successful!</h1><p>You can close this tab.</p>`);
        } catch (error) {
            console.error("❌ Error retrieving access token:", error.message);
            res.status(500).send("Authentication failed.");
        }
    } else {
        res.status(404).send("Not Found");
    }
};
