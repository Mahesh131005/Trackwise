const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const supabase = require("../db");

const router = express.Router();
const client = new OAuth2Client("552525546766-earub2pupqprvpvi7drglvnacqh5l2a0.apps.googleusercontent.com");
console.log("📦 Auth routes loaded");

// Email/password login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashed }]);

  if (error) {
    // If it's a duplicate email error → send a cleaner message
    if (error.message.includes("duplicate key")) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Otherwise send the actual error
    return res.status(400).json({ message: error.message });
  }

  res.status(201).json({ message: "Signup successful" });
});

// Google login
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "552525546766-earub2pupqprvpvi7drglvnacqh5l2a0.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Step 1: Try finding existing user
    let { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // Step 2: If not found, create new user

    if (error || !user) {
      console.log("Creating user:", email);
      const { data: newUser, error: insertErr } = await supabase
        .from("users")
        .insert([{ email, password: "" }])
        .select()
        .single();

      if (insertErr) {
        console.error("❌ Supabase insert error:", insertErr);
        return res.status(500).json({ message: "Failed to create user" });
      }

      user = newUser;
    }

    // Step 3: Sign and return token
    const appToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: appToken });
  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(401).json({ message: "Invalid Google token" });
  }
});


module.exports = router;
