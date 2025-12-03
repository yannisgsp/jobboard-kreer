import { CompanyModel } from "../models/company_model.js";
import { JobModel } from "../models/job_model.js";

import type { Job } from "../models/job_model.js";
import type { Request, Response } from "express";

export default class JobController {
  public static async create(req: Request, res: Response) {
    try {
      const { title, description, salary, location, remote, skills, contract, number_candidates } = req.body;
      const companyId = req.session.userId;

      if (!title || !description || !salary || !location || !skills || !contract) {
        return res.status(400).json({ status: 400, message: "Veuillez remplir tous les champs correspondants" });
      }

      if (!companyId) {
        return res.status(400).json("Veuillez d'abord créer un compte entreprise.");
      }

      const nextId = (await JobModel.findAll()).length;
      const company = await CompanyModel.get_by_user_id(companyId);
      const company_logo = company?.logo;

      const data: Job = {
        job_id: nextId,
        title: title.toString(),
        description: description.toString(),
        salary: parseInt(salary.toString()),
        location: location.toString(),
        remote: remote.toString(),
        skills: Array.from(skills.toString().split(",")),
        contract: contract,
        number_candidates: number_candidates ? parseInt(number_candidates.toString()) : 0,
        job_photo: company_logo,
        company_id: companyId,
      };

      const job = await JobModel.create(data);
      return res.status(200).json(job);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public static async getByCompanyId(req: Request, res: Response) {
    try {
      const id = req.session.userId;
      const role = req.session.role;

      if (!id) {
        return res.status(400).json({ message: "ID manquant dans les paramètres" });
      }

      if (role != "admin" && role != "company") {
        return res.status(400).json({ message: "Connexion non autorisé" });
      }

      const company = await CompanyModel.get_by_user_id(id);

      if (company) {
        // @ts-ignore
        const jobs = await JobModel.findByCompanyId(company.company_id);
        return res.status(200).json(jobs);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
  public static async index(req: Request, res: Response) {
    const jobs: Job[] = await JobModel.findAll();
    return res.status(200).json(jobs);
  }

  public static async show(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 400 });
    }
    const job = await JobModel.findById(parseInt(id));
    return res.status(200).json(job);
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 400 });
    }

    const { userId, role } = req.session;
    const numericId = Number(id);

    const old_values = await JobModel.findById(numericId);

    if (role != "admin") {
      const company = await CompanyModel.get_by_user_id(userId!);

      // @ts-ignore
      if (old_values?.company_id != company!.company_id) {
        res.status(401).json({ error: "Unauthorized access" });
      }
    }

    const new_values = {
      title: req.body.title,
      description: req.body.description,
      salary: req.body.salary,
      location: req.body.location,
      remote: req.body.remote,
      skills: req.body.skills,
      contract: req.body.contract,
      number_candidates: req.body.number_candidates,
    };

    const job = await JobModel.updateJob(numericId, {
      title: new_values.title ? new_values.title : old_values!.title,
      description: new_values.description ? new_values.description : old_values!.description,
      salary: new_values.salary ? new_values.salary : old_values!.salary,
      location: new_values.location ? new_values.location : old_values!.location,
      remote: new_values.remote ? new_values.remote : old_values!.remote,
      skills: new_values.skills ? new_values.skills : old_values!.skills,
      contract: new_values.contract ? new_values.contract : old_values!.contract,
      number_candidates: new_values.number_candidates ? new_values.number_candidates : old_values!.number_candidates,
    });
    return res.status(200).json(job);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: 400 });
    }

    const { userId, role } = req.session;
    const numericId = Number(id);

    if (role != "admin") {
      const job = await JobModel.findById(numericId);
      const company = await CompanyModel.get_by_user_id(userId!);
      // @ts-ignore
      if (job?.company_id != company!.company_id) {
        res.status(401).json({ error: "Unauthorized access" });
      }
    }

    await JobModel.deleteJob(numericId);
    return res.status(200).json("Job was deleted");
  }

  static async showUsersByApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Id manquant" });
      }

      const ApplicationUsers = await JobModel.getUsersByApplication(parseInt(id));

      if (!ApplicationUsers) {
        return res.status(400).json({ message: "Aucun utilisateur n'a candidaté pour l'instant !" });
      }

      return res.status(200).json(ApplicationUsers);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
}
