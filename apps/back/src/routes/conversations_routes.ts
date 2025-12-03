import { Router } from "express";
import { ConversationController } from "../controllers/conversation_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";

export const routerConversation = Router();

// AUTHENTICATE

// - all: show all depend on role
routerConversation.get("/", requireAuth, ConversationController.index);
// - user (participant) OR admin: show one depend on role
routerConversation.get("/:id", requireAuth, ConversationController.show);

// - trigger by application creation
// routerConversation.post("/", ConversationController.startConversation);

// - trigger by ON CASCADE application deletion
// routerConversation.delete("/:id", ConversationController.handleDelete);
