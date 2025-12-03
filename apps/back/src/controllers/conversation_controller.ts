import { CompanyModel } from "../models/company_model.js";
import { ConversationModel, Conversation } from "../models/conversation_model.js";
import { Request, Response } from "express";

export class ConversationController {
  static async startConversation(req: Request, res: Response) {
    try {
      const { user_id, application_id } = req.body;

      if (!user_id || !application_id) {
        return res.status(400).json({ error: "user_id et application_id sont requis" });
      }

      const conversation = await ConversationModel.create(user_id, application_id);
      return res.status(200).json({ conversation });
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async index(req: Request, res: Response) {
    try {
      const { userId, role } = req.session;
      let conversations;

      switch (role) {
        case "company":
          const company = await CompanyModel.get_by_user_id(userId!);

          if (!company) {
            return res.status(400).json({ error: "Company not found" });
          }
          // @ts-ignore
          const company_id = company.company_id;
          conversations = await ConversationModel.get_all_by_company_id(company_id);
          break;
        case "user":
          conversations = await ConversationModel.get_all_by_user_id(userId!);
          break;
        case "admin":
          conversations = await ConversationModel.getAll();
          break;
        default:
          return res.status(400).json({ error: "Unauthorized access" });
      }

      if (!conversations || conversations.length === 0) {
        return res.status(404).json({ error: "Aucune conversation disponible" });
      }

      return res.status(200).json({ conversations });
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur !" });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const numericId = Number(id);

      if (!numericId) {
        return res.status(404).json({ error: "Aucune conversation trouvée !" });
      }

      const { userId, role } = req.session;
      let conversation;

      switch (role) {
        case "company":
          const company = await CompanyModel.get_by_user_id(userId!);

          if (!company) {
            return res.status(400).json({ error: "Company not found" });
          }

          // @ts-ignore
          const company_id = company.company_id;
          conversation = await ConversationModel.get_by_id_for_company(numericId, company_id);
          break;
        case "user":
          const data = await ConversationModel.getbyID(numericId);
          if (!data) {
            return res.status(400).json({ error: "Conversation not found" });
          }
          if (data.user_id === userId) {
            conversation = data;
          }
          break;
        case "admin":
          conversation = await ConversationModel.getbyID(numericId);
          break;
        default:
          return res.status(400).json({ error: "Unauthorized access" });
      }

      if (!conversation) {
        res.status(404).json({ error: "Aucune conversation trouvée !" });
      }

      return res.status(200).json(conversation);
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur !" });
    }
  }

  static async handleDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const numericId = Number(id);

      if (isNaN(numericId)) {
        return res.status(404).json({ error: "Aucune conversation trouvée !" });
      }

      const deleted = await ConversationModel.delete(numericId);

      if (!deleted) {
        return res.status(404).json({ error: "Impossible de supprimer la conversation" });
      }

      return res.status(200).json({ message: "Conversation supprimée !" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
