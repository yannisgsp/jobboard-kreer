import { Router } from "express";
import { UserController } from "../controllers/user_controllers.js";
import { AuthController } from "../controllers/auth_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import { hasRole } from "../middleware/role_middleware.js";

export const routerUser = Router();

routerUser.post("/login", AuthController.login);
routerUser.post("/logout", AuthController.logout);
routerUser.post("/register", AuthController.register);

// AUTHENTICATE

// - user OR admin
routerUser.get("/profile", requireAuth, UserController.show);
routerUser.put("/:id", requireAuth, UserController.handleUpdate);
routerUser.delete("/:id", requireAuth, UserController.handleDelete);

// - admin: show all users
routerUser.get("/", requireAuth, hasRole(["admin"]), UserController.index);
