import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Blob } from "buffer";
import { pool } from "../config/db.js";

type contract = "CDI" | "CDD" | "Alternance" | "Stage" | "Temps partiel";
type mySqlBool = 0 | 1;

export interface Job {
  job_id?: number;
  company_id?: number;
  title: string;
  description: string;
  salary: number;
  location: string;
  remote: string;
  skills: string[];
  contract: contract;
  number_candidates?: number;
  job_photo?: string;
}

export class JobModel {
  public static async create(data: Job) {
    const query: string =
      "INSERT INTO Jobs (title, description, salary, location, remote, skills, contract, company_id) VALUE (?, ?, ?, ?, ?, ?, ?, ?);";
    const values: string[] = [
      data.title,
      data.description,
      data.salary.toString(),
      data.location,
      data.remote.toString(),
      data.skills.toString(),
      data.contract.toString(),
      data.company_id!.toString(),
    ];
    const [result] = await pool.execute<ResultSetHeader>(query, values);
    const insertedId = result.insertId;

    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM Jobs WHERE job_id = ?", [insertedId]);
    return rows[0];
  }

  public static async findAll(): Promise<Job[]> {
    const query = "SELECT * FROM Jobs;";
    const [jobs] = await pool.execute<Job[] & RowDataPacket[][]>(query);
    return jobs;
  }

  public static async findById(id: number): Promise<Job | undefined> {
    const query = "SELECT * FROM Jobs WHERE job_id=?;";
    const [job] = await pool.execute<Job[] & RowDataPacket[][]>(query, [id]);
    return job[0];
  }

  public static async findByCompanyId(id: number): Promise<Job[]> {
    const query = "SELECT * FROM Jobs WHERE company_id=?";
    const [rows] = await pool.execute<Job[] & RowDataPacket[][]>(query, [id]);
    return rows;
  }

  public static async updateJob(id: number, data: Job): Promise<Job | undefined> {
    const query =
      "UPDATE Jobs SET title = ?, description = ?, salary = ?, location = ?, remote = ?, skills = ?, contract = ? WHERE job_id = ?";
    const values: string[] = [
      data.title,
      data.description,
      data.salary.toString(),
      data.location,
      data.remote.toString(),
      data.skills.toString(),
      data.contract.toString(),
      id.toString(),
    ];
    await pool.execute<ResultSetHeader>(query, values);
    const job = this.findById(id);
    return job;
  }

  public static async deleteJob(id: number): Promise<void> {
    const query = "DELETE FROM Jobs WHERE job_id = ?;";
    await pool.execute<ResultSetHeader>(query, [id]);
  }

  static async getUsersByApplication(jobId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
    SELECT *
    FROM Users
    JOIN Applications ON Applications.user_id = Users.user_id
    WHERE Applications.job_id = ?
    `,
      [jobId],
    );

    return rows;
  }
}
