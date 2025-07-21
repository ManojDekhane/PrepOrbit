const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { name, feedback, rating } = req.body;

  if (!name || !feedback || !rating) {
    return res.status(400).json({ message: "Name, feedback, and rating are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_TO,
      subject: "📬 New Feedback Submission",
      html: `
        <h2>Feedback Details</h2>
        <p><strong>👤 Name:</strong> ${name}</p>
        <p><strong>💬 Feedback:</strong><br/>${feedback}</p>
        <p><strong>⭐ Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Feedback with rating sent successfully!" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ message: "Failed to send feedback" });
  }
});

module.exports = router;
