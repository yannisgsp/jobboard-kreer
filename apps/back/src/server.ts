import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import crypto from "crypto";
import express, { Request, Response } from "express";
import session from "express-session";

import { routerApi } from "./route.js";
import { fileURLToPath } from "url";

dotenv.config({ path: path.resolve(import.meta.url, "../.env") });

const PORT = 3000;

const app = express();
const secretKey = crypto.randomBytes(32).toString("hex");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "assets/uploads")));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());

// Middleware de session -> crée un objet req.session à chaque requête, si le client a un cookie de session, elle attache les donénes de session à req.session
app.use(
  session({
    secret: secretKey, // sert à signer la session (connect.sid)
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false /* permet l'accès qu'en HTTPS, false pour les tests, doit passer true en prod */,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("It's work!");
});

app.get("/api/company", (req, res) => {
  const role = req.session?.role || "company";
  res.json({ role });
});

app.use("/api", routerApi);

app
  .listen(PORT, () => {
    console.log(`\n    🌐 Server running at http://localhost:${PORT}\n`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
