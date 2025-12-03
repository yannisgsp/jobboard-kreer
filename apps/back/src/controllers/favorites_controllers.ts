import { FavoriteModel, Favorite } from "../models/favorites_model.js";
import { Request, Response } from "express";

export class FavoriteController {
  static async show(req: Request, res: Response) {
    const { id } = req.params;
    const numericId = Number(id);

    const favorite = await FavoriteModel.getById(numericId);

    if (!favorite) {
      res.status(404).json({ error: "Aucun favori trouvé !" });
    }

    res.status(200).json({ favorite });
  }

  static async indexUser(req: Request, res: Response) {
    const { id } = req.params;
    const numericId = Number(id);
    const { userId, role } = req.session;

    if (role != "admin" && userId != numericId) {
      return res.status(400).json({ error: "Unauthorized access" });
    }

    const favorites = await FavoriteModel.getByUserId(numericId);

    if (!favorites || favorites.length === 0) {
      res.status(404).json({ error: "Aucun favori trouvé !" });
    }

    res.status(200).json({ favorites });
  }

  static async add(req: Request, res: Response) {
    const { job_id } = req.body;
    const { userId } = req.session;

    const newFavorite = await FavoriteModel.add(userId!, job_id);

    if (!newFavorite) {
      res.status(404).json({ error: "Impossible d'ajouter en favori !" });
    }

    res.status(200).json({ newFavorite });
  }

  static async index(req: Request, res: Response) {
    const favorites = await FavoriteModel.getAll();

    if (!favorites) {
      res.status(404).json({ error: "Aucun favoris trouvé !" });
    }
    res.status(200).json({ favorites });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const numericId = Number(id);
    const { userId, role } = req.session;

    const favorite = await FavoriteModel.getById(numericId);

    if (!favorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    if (role != "admin" && favorite!.user_id !== userId) {
      return res.status(400).json({ error: "Unauthorized access" });
    }

    const deleted_favorite = await FavoriteModel.delete(numericId);

    if (!deleted_favorite) {
      return res.status(404).json({ error: "Unable to delete favorite" });
    }
    return res.status(200).json("Favori supprimé !");
  }
}
