import { ApplicationModel } from "../models/application_model.js";

import type { Application } from "../models/application_model.js";
import type { Request, Response } from "express";
import { CompanyModel } from "../models/company_model.js";
import { JobModel } from "../models/job_model.js";
import { ConversationController } from "./conversation_controller.js";
import { ConversationModel } from "../models/conversation_model.js";

export default class ApplicationController {
  public static async create(req: Request, res: Response) {
    const { application_status } = req.body;
    const { jobId } = req.params;

    if (!jobId || !application_status) {
      return res.status(400).json({ status: 400 });
    }

    const { userId } = req.session;
    const numericId = Number(jobId);

    const user_applications = await ApplicationModel.findByUser(userId!);
    user_applications.forEach((app: Application) => {
      if (app.job_id === numericId) {
        res.status(409).json({ error: "conflict, data already exist" });
      }
    });

    const data: Application = {
      job_id: parseInt(jobId),
      user_id: userId!,
      application_status: application_status.toString(),
    };

    const application = await ApplicationModel.create(data);
    if (application) {
      await ConversationModel.create(userId!, application.application_id!);
    }
    return res.status(200).json(application);
  }

  public static async index(req: Request, res: Response) {
    const { userId, role } = req.session;
    if (role != "admin") {
      const company = await CompanyModel.get_by_user_id(userId!);
      // @ts-ignore
      const company_id = company.company_id;
      return res.status(200).json(await ApplicationModel.find_by_company_id(company_id));
    }
    return res.status(200).json(await ApplicationModel.findAll());
  }

  public static async show(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 400 });
    }
    const numericId = Number(id);
    const { userId, role } = req.session;

    const application = await ApplicationModel.findbyId(numericId);

    if (role != "admin") {
      if (application?.user_id != userId) {
        res.status(401).json({ error: "Unauthorized access" });
      }
    }

    return res.status(200).json(application);
  }

  public static async indexUser(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 400 });
    }

    const numericId = Number(id);
    const { userId, role } = req.session;
    if (numericId != userId! && role != "admin") {
      res.status(401).json({ error: "Unauthorized access" });
    }
    const applications = await ApplicationModel.findByUser(numericId);
    return res.status(200).json(applications);
  }

  public static async indexJob(req: Request, res: Response) {
    const { jobId } = req.params;
    if (!jobId) {
      return res.status(400).json({ status: 400 });
    }
    const numericId = Number(jobId);
    const { userId, role } = req.session;
    const applications = await ApplicationModel.findByJob(numericId);

    if (role != "admin") {
      const company = await CompanyModel.get_by_user_id(userId!);
      const job = await JobModel.findById(numericId);
      // @ts-ignore
      if (company.company_id != job?.company_id) {
        res.status(401).json({ error: "Unauthorized access" });
      }
    }

    return res.status(200).json(applications);
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { application_status } = req.body;

    if (!id) {
      return res.status(400).json({ status: 400 });
    }

    const numericId = Number(id);
    const { userId, role } = req.session;

    const application = await ApplicationModel.findbyId(numericId);
    if (!application) {
      return res.status(400).json({ error: "Application not found" });
    }

    if (role != "admin") {
      const company = await CompanyModel.get_by_user_id(userId!);
      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }
      const job = await JobModel.findById(application.job_id);
      if (!job) {
        return res.status(400).json({ error: "Job not found" });
      }
      // @ts-ignore
      const company_id = company.company_id;
      if (job.company_id != company_id) {
        return res.status(401).json({ error: "Unauthorized acces" });
      }
    }

    await ApplicationModel.updateApplicationStatus(numericId, application_status);
    const updated_app = await ApplicationModel.findbyId(numericId);

    if (!updated_app) {
      return res.status(400).json({ status: 400 });
    }

    return res.status(200).json(updated_app);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 400 });
    }

    const numericId = Number(id);
    const { userId, role } = req.session;

    const application = await ApplicationModel.findbyId(numericId);
    if (!application) {
      return res.status(400).json({ error: "Application not found" });
    }

    if (role != "admin") {
      const company = await CompanyModel.get_by_user_id(userId!);
      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }
      const job = await JobModel.findById(application.job_id);

      if (!job) {
        return res.status(400).json({ error: "Job not found" });
      }

      // @ts-ignore
      const company_id = company.company_id;
      if (job!.company_id != company_id) {
        return res.status(401).json({ error: "Unauthorized acces" });
      }
    }

    await ApplicationModel.deleteApplication(numericId);
    return res.status(200).json("Application was deleted");
  }
}
