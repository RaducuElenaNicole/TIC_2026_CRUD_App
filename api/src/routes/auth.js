const express = require("express");
const router = express.Router();

const db = require("../db");

const { hashPassword, comparePassword, generateToken } = require("../authentication/auth");
const { registerValidation, loginValidation } = require("../validators/authValidator");
const { handleValidation } = require("../middleware/handleValidation");

// POST /auth/register
router.post("/register", registerValidation, handleValidation, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // verific daca emailul exista deja 
    const existing = await db.collection("users").where("email", "==", email).limit(1).get();
    if (!existing.empty) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // hash la parola
    const passwordHash = await hashPassword(password);

    // salvez user in firestore
    const userRef = await db.collection("users").add({
      firstName,
      lastName,
      email,
      passwordHash,
      createdAt: new Date(),
    });

    // generez token
    const user = { id: userRef.id, email };
    const token = generateToken(user);

    return res.status(201).json({
      message: "User created",
      token,
      user: { id: userRef.id, firstName, lastName, email },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /auth/login
router.post("/login", loginValidation, handleValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    // caut user by email
    const snap = await db.collection("users").where("email", "==", email).limit(1).get();
    if (snap.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doc = snap.docs[0];
    const userData = doc.data();

    // verific parola 
    const ok = await comparePassword(password, userData.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generez token
    const user = { id: doc.id, email: userData.email };
    const token = generateToken(user);

    return res.json({
      message: "Logged in",
      token,
      user: {
        id: doc.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;