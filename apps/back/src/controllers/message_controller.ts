import { CompanyModel } from "../models/company_model.js";
import { ConversationModel } from "../models/conversation_model.js";
import { Message, MessageModel } from "../models/message_model.js";
import type { Request, Response } from "express";

export default class MessageController {
  public static async create(req: Request, res: Response) {
    try {
      if (!req.params.convId) {
        throw new Error("Undefined message route param id");
      }
      const id = parseInt(req.params.convId);
      const { content } = req.body;
      const { userId, role } = req.session;

      const payload: Message = {
        content: content,
        user_id: userId!,
        conversation_id: id,
      };

      if (role === "user") {
        const conversation = await ConversationModel.getbyID(id);
        if (!conversation) {
          return res.status(400).json({ error: `Conversation with id ${id} not found` });
        }
        if (conversation.user_id != userId) {
          return res.status(400).json({ error: "Unauthorized access" });
        }
      }

      if (role === "company") {
        const company = await CompanyModel.get_by_user_id(userId!);
        if (!company) {
          return res.status(400).json({ error: `No company associeted for user with id ${userId}` });
        }
        // @ts-ignore
        const company_id = company.company_id;
        const conversation = await ConversationModel.getbyID(id);

        if (!conversation) {
          return res.status(400).json({ error: "No conversations found" });
        }

        if (conversation.user_id != userId) {
          return res.status(400).json({ error: "Unauthorized access" });
        }
      }

      const message = await MessageModel.create(payload);

      return res.status(200).json(message);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public static async index(req: Request, res: Response) {
    try {
      const messages = await MessageModel.get_all();
      return res.status(200).json(messages);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public static async show(req: Request, res: Response) {
    try {
      if (!req.params.id) {
        throw new Error("Undefined message route param id");
      }
      const id = parseInt(req.params.id);
      const { userId, role } = req.session;
      const message = await MessageModel.get_by_id(id);

      if (role != "admin" && message.user_id != userId) {
        return res.status(400).json({ error: "Unauthorized access" });
      }

      return res.status(200).json(message);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public static async show_user_messages(req: Request, res: Response) {
    try {
      if (!req.params.userId) {
        throw new Error("Undefined message route param id");
      }

      const id = parseInt(req.params.userId);
      const { userId, role } = req.session;

      if (role != "admin" && userId != id) {
        return res.status(400).json({ error: "Unauthorized access" });
      }

      const messages = await MessageModel.get_by_user_id(id);

      if (!messages || messages.length === 0) {
        return res.status(400).json({ error: "No message found" });
      }

      return res.status(200).json(messages);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public static async show_conv_message(req: Request, res: Response) {
    try {
      if (!req.params.convId) {
        throw new Error("Undefined message route param id");
      }

      const id = parseInt(req.params.convId);
      const { userId, role } = req.session;

      let messages;

      if (role === "user") {
        const conversation = await ConversationModel.getbyID(id);
        if (!conversation) {
          return res.status(400).json({ error: `Conversation with id ${id} not found` });
        }
        if (conversation.user_id != userId) {
          return res.status(400).json({ error: "Unauthorized access" });
        }
        messages = await MessageModel.get_by_conv_id(id);
      }

      if (role === "company") {
        const company = await CompanyModel.get_by_user_id(userId!);
        if (!company) {
          return res.status(400).json({ error: `No company associeted for user with id ${userId}` });
        }
        // @ts-ignore
        const company_id = company.company_id;
        const conversation = await ConversationModel.getbyID(id);

        if (!conversation) {
          return res.status(400).json({ error: "No conversations found" });
        }

        if (conversation.user_id != userId) {
          return res.status(400).json({ error: "Unauthorized access" });
        }

        messages = await MessageModel.get_by_conv_id(conversation.conversation_id!);
      }

      if (role === "admin") {
        messages = await MessageModel.get_by_conv_id(id);
      }

      if (!messages || messages.length === 0) {
        return res.status(400).json({ error: "No messages for this conversation" });
      }

      return res.status(200).json(messages);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      if (!req.params.id) {
        throw new Error("Undefined message route param id");
      }
      const { content } = req.body;
      const id = parseInt(req.params.id);
      const { userId, role } = req.session;

      const message = await MessageModel.get_by_id(id);

      if (role != "admin" && message.user_id != userId) {
        return res.status(400).json({ error: "Unauthorized access" });
      }

      const updated_message = await MessageModel.update(content, id);

      return res.status(200).json(updated_message);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      if (!req.params.id) {
        throw new Error("Undefined message route param id");
      }
      const id = parseInt(req.params.id);
      const { userId, role } = req.session;
      const message = await MessageModel.get_by_id(id);

      if (role != "admin" && message.user_id != userId) {
        return res.status(400).json({ error: "Unauthorized access" });
      }

      const deleted_message = await MessageModel.delete(id);

      return res.status(200).json({ deleted_message, status: "deleted" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  public static async show_application_messages(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "URL param error" });
      const numericId = Number(id);
      const messages = await MessageModel.get_by_application_id(numericId);
      return res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Server error" });
    }
  }
}
