const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is running! Use /token to get the GitHub token.");
});

app.get("/token", (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
        return res.status(500).json({ error: "GitHub token is missing in the environment variables." });
    }
    
    res.json({ token });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
