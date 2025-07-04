const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const supabase = require("../db");

const router = express.Router();
const client = new OAuth2Client("552525546766-earub2pupqprvpvi7drglvnacqh5l2a0.apps.googleusercontent.com");
router.post("/auth/login",async,(req,res)=>{
  
})
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "552525546766-earub2pupqprvpvi7drglvnacqh5l2a0.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }
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
