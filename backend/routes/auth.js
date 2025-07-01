const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleWare");
const { saveAttempt } = require("../controllers/attemptController");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;

    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({msg: "User already exists"});
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save user to DB
        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({msg: "User registered successfully"});
    } catch (err) {
        res.status(500).json({msg: "Server error"});
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({msg: "Invalid credentials"});
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({msg: "Invalid credentials"});
        }

        // 3. Sign JWT Token
        const token = jwt.sign(
            {userId: user._id, isAdmin: user.isAdmin},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 3600000,
        });

        res.json({
            token, 
            user: {
                id: user._id, 
                name: user.name, 
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (err) {
        res.status(500).json({msg: "Server error"});
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "None",
        secure: true
    });
    res.json({ msg: "Logged out successfully" });
})

router.get("/check", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        res.json({user});
    } catch (err) {
        res.status(500).json({msg: "Auth check failed"});
    }
})

module.exports = router;