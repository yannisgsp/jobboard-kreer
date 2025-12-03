import { CompanyModel } from "../models/company_model.js";

import type { Company } from "../models/company_model.js";
import type { Request, Response } from "express";

export default class CompanyController {
  public static async create(req: Request, res: Response) {
    const { name, description, location } = req.body;
    const { userId } = req.session;

    const logoPath = req.file ? `../assets/uploads/logos/${req.file.filename}` : req.body.logo || null;

    const data: Company = {
      name: name,
      logo: logoPath,
      description: description,
      location: location,
    };

    const company = await CompanyModel.create(data);
    return res.status(200).json(company);
  }

  public static async index(req: Request, res: Response) {
    const companies: Company[] = await CompanyModel.get_all();
    return res.status(200).json(companies);
  }

  public static async show(req: Request, res: Response) {
    const id = req.session.userId;

    if (!id) {
      return res.status(400).json({ status: 400 });
    }
    const company = await CompanyModel.get_by_id(id);

    return res.status(200).json(company);
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 400 });
    }

    const old_values = await CompanyModel.get_by_id(parseInt(id));

    const logoPath = req.file ? `/uploads/logos/${req.file.filename}` : old_values!.logo || "";
    const new_values: Company = {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      logo: logoPath,
    };

    const company = await CompanyModel.update({
      id: parseInt(id),
      name: new_values.name ? new_values.name : old_values!.name,
      description: new_values.description ? new_values.description : old_values!.description,
      location: new_values.location ? new_values.location : old_values!.location,
      logo: new_values.logo ? new_values.logo : old_values!.logo,
    });

    return res.status(200).json(company);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 400 });
    }
    const company = await CompanyModel.delete(parseInt(id));
    return res.status(200).json(company);
  }
}
