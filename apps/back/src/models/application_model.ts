import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";

type status =
  | "rejetée"
  | "en attente de retour"
  | "embauché"
  | "entretien"
  | "screening"
  | "postulé"
  | "en cours d'examen";

export interface Application {
  application_id?: number;
  user_id: number;
  job_id: number;
  application_status: status;
}

export class ApplicationModel {
  public static async create(data: Application): Promise<Application> {
    const query: string = "INSERT INTO Applications (user_id, job_id, application_status) VALUE (?, ?, ?);";
    const values: string[] = [data.user_id.toString(), data.job_id.toString(), data.application_status.toString()];
    const [result] = await pool.execute<ResultSetHeader>(query, values);
    const insertedId = result.insertId;
    return { application_id: insertedId, ...data };
  }

  public static async findAll(): Promise<Application[]> {
    const query: string = "SELECT * FROM Applications;";
    const [applications] = await pool.execute<Application[] & RowDataPacket[][]>(query);
    return applications;
  }

  public static async findbyId(id: number): Promise<Application | undefined> {
    const query = "SELECT * from Applications WHERE application_id=?;";
    const [application] = await pool.execute<Application[] & RowDataPacket[][]>(query, [id]);
    return application[0];
  }

  public static async findByUser(user_id: number): Promise<Application[]> {
    const query = "SELECT * FROM Applications WHERE user_id = ?;";
    const [applications] = await pool.execute<Application[] & RowDataPacket[][]>(query, [user_id]);
    return applications;
  }

  public static async findByJob(job_id: number): Promise<Application[]> {
    const query = "SELECT * FROM Applications WHERE job_id = ?;";
    const [applications] = await pool.execute<Application[] & RowDataPacket[][]>(query, [job_id]);
    return applications;
  }

  public static async updateApplicationStatus(id: number, status: status): Promise<void> {
    const query = "UPDATE Applications SET application_status = ? WHERE application_id = ?;";
    await pool.execute<ResultSetHeader>(query, [status, id]);
  }

  public static async deleteApplication(application_id: number): Promise<void> {
    const query = "DELETE FROM Applications WHERE application_id = ?;";
    await pool.execute<ResultSetHeader>(query, [application_id]);
  }

  public static async find_by_company_id(id: number): Promise<Application[]> {
    const query = `
      SELECT * FROM Applications WHERE job_id IN
        (SELECT job_id FROM Jobs WHERE company_id = ?);
    `;
    const [applications] = await pool.execute<Application[] & RowDataPacket[][]>(query, [id]);
    return applications;
  }
}
