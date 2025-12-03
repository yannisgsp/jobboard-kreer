import { pool } from "../config/db.js";
import { ResultSetHeader, type RowDataPacket } from "mysql2";

export interface Message {
  id?: number;
  content: string;
  user_id: number;
  conversation_id: number;
}

export class MessageModel {
  public static async create(payload: Message): Promise<Message> {
    const { content, user_id, conversation_id } = payload;
    const query = "INSERT INTO Messages (content, user_id, conversation_id) VALUES (?, ?, ?)";
    const [result] = await pool.execute<ResultSetHeader>(query, [content, user_id, conversation_id]);
    const message = this.get_by_id(result.insertId);
    return message;
  }

  public static async get_all(): Promise<Message[]> {
    const query = "SELECT * FROM Messages;";
    const [messages] = await pool.execute<Message[] & RowDataPacket[][]>(query);
    return messages;
  }

  public static async get_by_id(id: number): Promise<Message> {
    const query = "SELECT * FROM Messages WHERE message_id = ?;";
    const [message] = await pool.execute<Message[] & RowDataPacket[][]>(query, [id]);
    if (message.length === 0 || message === undefined) {
      throw new Error("Data not found.");
    }
    return message[0]!;
  }

  public static async get_by_user_id(id: number): Promise<Message[]> {
    const query = "SELECT * from Messages WHERE user_id = ?;";
    const [message] = await pool.execute<Message[] & RowDataPacket[][]>(query, [id]);
    if (message.length === 0 || message === undefined) throw new Error("Data not found.");
    return message;
  }

  public static async get_by_conv_id(id: number): Promise<Message[]> {
    const query = "SELECT * from Messages WHERE conversation_id = ?;";
    const [message] = await pool.execute<Message[] & RowDataPacket[][]>(query, [id]);
    if (message.length === 0 || message === undefined) throw new Error("Data not found.");
    return message;
  }

  public static async update(content: string, id: number): Promise<Message> {
    const query = "UPDATE Messages SET content = ? WHERE message_id = ?;";
    await pool.execute<ResultSetHeader>(query, [content, id]);
    const message = await this.get_by_id(id);
    return message;
  }

  public static async delete(id: number): Promise<Message> {
    const query = "DELETE FROM Messages WHERE message_id = ?;";
    const message = this.get_by_id(id);
    await pool.execute<ResultSetHeader>(query, [id]);
    return message;
  }

  public static async get_by_application_id(id: number): Promise<Message[]> {
    const query = `
      SELECT * FROM Messages WHERE conversation_id IN (
        SELECT conversation_id FROM Conversations WHERE application_id = ?);
    `;
    const [messages] = await pool.execute<Message[] & RowDataPacket[][]>(query, [id]);
    return messages;
  }
}
