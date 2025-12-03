import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";

export interface Company {
  id?: number;
  name: string;
  logo: string;
  description: string;
  location: string;
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class CompanyModel {
  public static async create(data: Company): Promise<Company> {
    const query: string = "INSERT INTO Companies (name, description, location, user_id) VALUE (?, ?, ?, ?);";
    const values: string[] = [data.name, data.description, data.location, data.user_id!.toString()];

    const [result] = await pool.execute<ResultSetHeader>(query, values);

    const insertId = result.insertId;

    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Companies WHERE company_id = ?", [insertId]);

    return rows[0] as Company;
  }

  public static async get_all(): Promise<Company[]> {
    const query = "SELECT * FROM Companies;";
    const [companies] = await pool.execute<[] & RowDataPacket[][]>(query);
    return companies;
  }

  public static async get_by_id(id: number): Promise<Company | undefined> {
    const query = "SELECT * FROM Companies WHERE company_id = ?;";
    const [company] = await pool.execute<Company[] & RowDataPacket[]>(query, [id]);
    return company[0];
  }

  public static async update(data: Company): Promise<Company | undefined> {
    const { id, name, description, location } = data;
    const query = "UPDATE Companies SET name = ?, description = ?, location = ? WHERE company_id = ?;";
    await pool.execute<ResultSetHeader>(query, [name, description, location, id]);
    const company = this.get_by_id(id!);
    return company;
  }

  public static async delete(id: number): Promise<Company | undefined> {
    const query = "DELETE FROM Companies WHERE company_id=?";
    const company = this.get_by_id(id);
    await pool.execute<ResultSetHeader>(query, [id]);
    return company;
  }

  public static async get_by_user_id(user_id: number): Promise<Company | undefined> {
    const query = "SELECT * FROM Companies WHERE user_id = ?;";
    const [company] = await pool.execute<Company[] & RowDataPacket[][]>(query, [user_id]);
    return company[0];
  }
}
