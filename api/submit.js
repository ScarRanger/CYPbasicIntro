const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");
const dorenv = require("dotenv").config();

const router = express.Router();

const SPREADSHEET_ID = process.env.SHEET_ID;
const FOLDER_ID = process.env.DRIVE_FOLDER_ID;

const auth = new google.auth.OAuth2();
auth.setCredentials(JSON.parse(fs.readFileSync(path.join(__dirname, "token.json"))));

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("Upload a Screenshot of Payment"), async (req, res) => {
    try {
        const {
            Email,
            "Full Name": fullName,
            Gender,
            Age,
            "How long have you been in CYP?": CYPDuration,
            "Your Contact Number": contact,
            "Date of Birth": dob,
            "Parent's Contact Number": parentContact,
            "Your Parish": parish,
            "Which category do you belong to?": category,
            "Action Group": actionGroup,
            "Any Allergies or Sickness?": allergies,
            "Rules Acknowledgement": agreement
        } = req.body;

        const gender = Gender?.toLowerCase();

        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "main!C2:C",
        });
        const rows = readRes.data.values || [];
        const males = rows.filter(row => row[0]?.toLowerCase() === "male").length;
        const females = rows.filter(row => row[0]?.toLowerCase() === "female").length;

        if ((gender === "male" && males >= 40) || (gender === "female" && females >= 40)) {
            return res.status(400).json({ success: false, error: `No seats left for ${Gender}` });
        }

        const fileMetadata = {
            name: req.file.originalname,
            parents: [FOLDER_ID],
        };
        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        const driveFile = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: "id",
        });

        await drive.permissions.create({
            fileId: driveFile.data.id,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const imageUrl = `https://drive.google.com/uc?id=${driveFile.data.id}`;

        const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

        const values = [
            [
                timestamp,
                Email,
                fullName,
                Gender,
                Age,
                CYPDuration,
                contact,
                dob,
                parentContact,
                parish,
                category,
                actionGroup,
                allergies,
                imageUrl,
                agreement === "on" ? "Yes" : "No",
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "main!A1",
            valueInputOption: "USER_ENTERED",
            resource: {
                values,
            },
        });

        fs.unlinkSync(req.file.path);

        res.json({ success: true, message: "Form submitted successfully." });

    } catch (err) {
        console.error("Submission Error:", err);
        res.status(500).json({ success: false, error: "Submission failed." });
    }
});

const app = express();
app.use(express.json());
app.use("/", upload.single("Upload a Screenshot of Payment"), router);

module.exports = app;
