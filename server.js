require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const Clip = require("./models/Clip");

const app = express();
app.use(express.json());

// 🌟 Serve the frontend UI
app.use(express.static(path.join(__dirname, "public")));

// 🔗 Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("MongoDB connected successfully ✨"))
    .catch(err => {
        console.error("❌ MongoDB connection failed!");
        console.error("Make sure MongoDB is installed and running on your local machine.");
        console.error("Error Details:", err.message);
    });

// 📌 Create clipboard (Updated to use /api prefix)
app.post("/api/create", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const code = uuidv4().slice(0, 6);

        const clip = new Clip({ code, text });
        await clip.save();

        res.json({ code });

    } catch (err) {
        console.error("Create error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// 📌 Retrieve clipboard (Updated to use /api/clip/:code prefix)
app.get("/api/clip/:code", async (req, res) => {
    try {
        const clip = await Clip.findOne({ code: req.params.code });

        if (!clip) {
            return res.status(404).json({ error: "Not found or expired" });
        }

        res.json({ text: clip.text });

    } catch (err) {
        console.error("Retrieve error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});