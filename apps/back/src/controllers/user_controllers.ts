import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user_model.js";

export class UserController {
  static async index(req: Request, res: Response) {
    try {
      const users = await UserModel.getAll();
      if (!users) {
        res.status(400).json({ error: "Aucun utilisateurs existant" });
      }
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { userId, role } = req.session;

      if (!userId) {
        return res.status(400).json({ error: "ID utilisateur manquant." });
      }

      const userProfile = await UserModel.findByID(userId);

      if (!userProfile) {
        return res.status(400).json({ error: "Profil non existant !" });
      }

      const { password, ...userWithoutPassword } = userProfile;

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async handleUpdate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      const { userId, role } = req.session;

      if (!numericId) {
        return res.status(400).json({ error: "ID utilisateur manquant." });
      }

      if (userId != numericId && role != "admin") {
        return res.status(400).json({ error: "Unauthorized access" });
      }

      const old_values = await UserModel.findByID(numericId);

      const new_values = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        description: req.body.description,
        avatar: req.body.avatar,
      };

      const updatedUser = await UserModel.updateUser({
        id: numericId,
        firstname: new_values.firstname ? new_values.firstname : old_values!.firstname,
        lastname: new_values.lastname ? new_values.lastname : old_values!.lastname,
        email: new_values.email ? new_values.email : old_values!.email,
        description: new_values.description ? new_values.description : old_values!.description,
        avatar: new_values.avatar ? new_values.avatar : old_values!.avatar,
      });

      if (!updatedUser) {
        return res.status(400).json({ error: "Utilisateur non trouvé" });
      }

      return res.status(200).json({ updatedUser });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async handleDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      const { userId, role } = req.session;

      if (!numericId) {
        return res.status(400).json({ error: "ID utilisateur manquant." });
      }

      if (userId != numericId && role != "admin") {
        return res.status(400).json({ error: "Unauthorized access" });
      }

      const deleted = await UserModel.deleteUser(numericId);

      if (!deleted) {
        return res.status(404).json({ error: "Impossible de supprimer l'utilisateur" });
      }

      return res.status(200).json({ message: "Utilisateur supprimé avec succès !" });
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }
}
