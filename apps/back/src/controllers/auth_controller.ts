import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user_model.js";
import bcrypt from "bcrypt";

export class AuthController {
  static async register(req: Request, res: Response) {
    const { firstname, lastname, avatar, email, password, description } = req.body;

    try {
      if (!firstname || !lastname || !email || !password) {
        return res.status(404).json({
          message: "Le prénom, nom, email et mot de passe sont obligatoires !",
        });
      }

      if (!firstname || firstname.length < 2) {
        return res.status(404).json({
          message: "Prénom invalide",
        });
      }

      if (!email || !email.includes("@")) {
        return res.status(404).json({
          message: "Email invalide",
        });
      }

      if (!password || password.length < 8) {
        return res.status(404).json({
          message: "Password trop court. Minimum 8 caractères",
        });
      }

      const existingUser = await UserModel.findByEmail(email);

      if (existingUser) {
        return res.status(404).json({ message: "Vous avez déjà un compte !" });
      }

      const newUser = await UserModel.createUser({
        firstname,
        lastname,
        email,
        password,
        avatar: avatar ?? null,
        description: description ?? null,
      });

      if (!newUser) {
        return res.status(500).json({ message: "Erreur lors de la création du compte." });
      }

      return res.status(200).json(newUser);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json("Email et mot de passe requis");
    }

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "Email incorrect" });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(401).json("Mot de passe incorrect");
    }

    // regenrer la session pour plus de securtiter notamment contre les sessions fixations
    req.session.regenerate(function (error) {
      if (error) return res.status(500).json({ message: "Erreur session", error: error });

      // création de la clé userId dans le req.session renvoyée par le middleware (middlexare dans server)
      req.session.userId = user.user_id;
      req.session.role = user.role;

      req.session.save(function (error) {
        if (error) return res.status(500).json({ message: "Erreur session", error: error });
      });

      return res.status(200).json({
        message: "Authentification réussie",
        user: {
          user_id: user.user_id,
          firstname: user.firstname,
          email: user.email,
          role: user.role,
        },
      });
    });
  }

  static async logout(req: Request, res: Response) {
    // Supprime la session côté serveur et le cookie
    req.session.destroy((error) => {
      if (error) return res.status(500).json({ message: "Erreur déconnexion", error: error });

      res.clearCookie("connect.sid"); // Nom par défaut du cookie express-session
      res.redirect("/");
    });
  }
}
