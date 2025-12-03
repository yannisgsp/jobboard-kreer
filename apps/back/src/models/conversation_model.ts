import { pool } from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Conversation {
  conversation_id?: number;
  user_id: number;
  application_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export class ConversationModel {
  public static async create(user_id: number, application_id: number): Promise<Conversation> {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO Conversations (user_id, application_id) VALUES (?, ?)",
      [user_id, application_id],
    );
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Conversations WHERE conversation_id = ?", [
      result.insertId,
    ]);

    return rows[0] as Conversation;
  }

  public static async getAll() {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Conversations");

    return rows;
  }

  public static async getbyID(id: number): Promise<Conversation | undefined> {
    const [rows] = await pool.execute<Conversation[] & RowDataPacket[][]>(
      "SELECT * FROM Conversations WHERE conversation_id = ?",
      [id],
    );

    return rows[0];
  }

  public static async delete(id: number) {
    await pool.execute("DELETE FROM Messages WHERE conversation_id = ?", [id]);
    const [result] = await pool.execute<ResultSetHeader>("DELETE FROM Conversations WHERE conversation_id = ?", [id]);

    return result.affectedRows > 0;
  }

  public static async get_all_by_company_id(id: number): Promise<Conversation[]> {
    const query = `
      SELECT * from Conversations WHERE application_id IN (
        SELECT application_id FROM Applications WHERE job_id IN (
          SELECT job_id From Jobs WHERE company_id = ?
        )
      );
    `;
    const [conversations] = await pool.execute<Conversation[] & RowDataPacket[][]>(query, [id]);
    return conversations;
  }

  public static async get_all_by_user_id(id: number): Promise<Conversation[]> {
    const query = `
      SELECT * FROM Conversations WHERE application_id IN (
        SELECT application_id FROM Applications WHERE user_id = ?
      );
    `;
    const [conversations] = await pool.execute<Conversation[] & RowDataPacket[][]>(query, [id]);
    return conversations;
  }

  public static async get_by_id_for_company(id: number, company_id: number): Promise<Conversation | undefined> {
    const query = `
      SELECT * from Conversations WHERE conversation_id = ? AND application_id IN (
        SELECT application_id FROM Applications WHERE job_id IN (
          SELECT job_id From Jobs WHERE company_id = ?
        )
      );
    `;
    const [conversation] = await pool.execute<Conversation[] & RowDataPacket[][]>(query, [id, company_id]);
    return conversation[0];
  }
}
