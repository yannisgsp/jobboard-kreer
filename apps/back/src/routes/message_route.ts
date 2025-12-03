import { Router } from "express";
import MessageController from "../controllers/message_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import { hasRole } from "../middleware/role_middleware.js";

export const routerMessage = Router();

// AUTHENTICATE

// - all: show all from conversation
routerMessage.get("/conversation/:convId", requireAuth, MessageController.show_conv_message);
// - all: show all (user or company)
routerMessage.get("/user/:userId", requireAuth, MessageController.show_user_messages);
// routerMessage.get("/application/:id", requireAuth, MessageController.show_application_messages);
// - all: create message inside conversation
routerMessage.post("/conversation/:convId", requireAuth, hasRole(["company", "user"]), MessageController.create);
// - owner OR admin
routerMessage.get("/:id", requireAuth, MessageController.show);
routerMessage.put("/:id", requireAuth, MessageController.update);
routerMessage.delete("/:id", requireAuth, MessageController.delete);
