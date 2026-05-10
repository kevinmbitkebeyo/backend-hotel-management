import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { hashPassword, comparePassword } from "../utils/auth.js";

const { User } = db;

export const signup = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    const hashed = await hashPassword(password);

    const user = await User.create({
      username,
      firstname,
      lastname,
      email,
      password: hashed,
      role: "user",
    });

    res.json({
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const profile = (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
    role: req.user.role,
  });
};
