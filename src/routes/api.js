// filepath: /home/muqsith/Development/fedex-2025/simple-mcp-server/src/routes/api.js
const express = require("express");
const router = express.Router();

// ping
router.get("/ping", (req, res) => {
  res.status(200).json({ message: "success" });
});

module.exports = router;
