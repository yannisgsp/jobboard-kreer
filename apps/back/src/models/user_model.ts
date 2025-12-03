import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User {
  firstname: string;
  lastname: string;
  avatar?: string;
  email: string;
  password: string;
  role?: string;
  description?: string;
}

type UserUpdate = Partial<Omit<User, "id" | "password">> & { id: number };

export class UserModel {
  static async createUser(data: User) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO Users(firstname,lastname,email,password,avatar,description) VALUES (?,?,?,?,?,?)",
        [data.firstname, data.lastname, data.email, hashedPassword, data.avatar, data.description],
      );

      const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Users WHERE user_id = ?", [result.insertId]);

      return rows[0];
    } catch (error: any) {
      console.error("Erreur dans createUser :", error);
      throw error;
    }
  }

  static async getAll() {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Users");

    return rows;
  }

  static async findByEmail(email: string) {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Users WHERE email = ?", [email]);

    return rows[0];
  }

  static async findByID(id: number) {
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Users WHERE user_id = ?", [id]);
    return rows[0];
  }

  static async updateUser(data: UserUpdate) {
    const { id, firstname, lastname, email, description, avatar } = data;

    const query =
      "UPDATE Users SET firstname = ?, lastname = ?, email = ?, description = ?, avatar = ? WHERE user_id = ?;";

    await pool.execute<ResultSetHeader>(query, [firstname, lastname, email, description, avatar, id]);
    const user = await this.findByID(id!);
    return user;
  }

  static async deleteUser(id: number) {
    const [result] = await pool.execute<ResultSetHeader>("DELETE FROM Users WHERE user_id = ?", [id]);

    return result.affectedRows > 0;
  }

  static async getUsersByApplication(jobId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
    SELECT Users.*
    FROM Users
    JOIN Applications ON Applications.user_id = Users.user_id
    WHERE Applications.job_id = ?
    `,
      [jobId],
    );

    return rows;
  }
}
