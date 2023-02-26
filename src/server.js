import { compare, hash } from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import connectDB from "./db.js";
import User from "./models/User.js";
const port = process.env.PORT || 5174;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await findOne({ email });

        if (!user) {
          return done(null, false, { message: "Email not found" });
        }

        const isMatch = await compare(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

connectDB();

app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      return res.status(200).json({ message: "Registration successful" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
  return res.status(200).json({ message: "Login successful" });
});

app.listen(port, () => {
  console.log(`Server listening on port localhost:${port}`);
});
