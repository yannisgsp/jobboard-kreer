import { pool } from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Favorite {
  conversation_id: number;
  user_id: number;
  job_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export class FavoriteModel {
  public static async add(user_id: number, job_id: number): Promise<Favorite | undefined> {
    const [user] = await pool.execute<RowDataPacket[]>("SELECT * FROM Users WHERE user_id = ?", [user_id]);
    if (user.length == 0) {
      throw new Error("Utilisateur non trouvé");
    }
    const [job] = await pool.execute<RowDataPacket[]>("SELECT * FROM Jobs WHERE job_id = ?", [job_id]);
    if (job.length == 0) {
      throw new Error("Job non trouvé");
    }

    // Ajoute le favori
    await pool.execute("INSERT INTO Favorites (user_id, job_id) VALUES (?, ?)", [user_id, job_id]);

    // Optionnel : renvoie la ligne créée
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Favorites WHERE user_id = ? AND job_id = ?", [
      user_id,
      job_id,
    ]);
    return rows[0] as Favorite;
  }

  public static async getAll() {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Favorites");

    return rows;
  }

  public static async delete(id: number) {
    const [result] = await pool.execute<ResultSetHeader>("DELETE FROM Favorites WHERE favorite_id = ?", [id]);

    return result.affectedRows > 0;
  }

  public static async getById(id: number): Promise<Favorite | undefined> {
    const [rows] = await pool.execute<Favorite[] & RowDataPacket[][]>("SELECT * FROM Favorites where favorite_id = ?", [
      id,
    ]);

    return rows[0];
  }

  public static async getByUserId(id: number): Promise<Favorite[]> {
    const [rows] = await pool.execute<Favorite[] & RowDataPacket[]>("SELECT * FROM Favorites where user_id = ?", [id]);

    return rows;
  }
}
