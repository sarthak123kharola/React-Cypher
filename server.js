const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Load API key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// // === Serve React Frontend ===
// app.use(express.static(path.join(__dirname, "reyna", "build")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "reyna", "build", "index.html"));
// });

// === Chat Route ===
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: userMessage }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        const botReply =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, no response from AI.";

        res.json({ reply: botReply });
    } catch (error) {
        console.error("Gemini API error:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong with the AI request." });
    }
});

// === Start the server ===
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
  
