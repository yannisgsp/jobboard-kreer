import { Router } from "express";
import ApplicationController from "../controllers/application_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import { hasRole } from "../middleware/role_middleware.js";

export const routerApplication = Router();

// AUTHENTICATE

// - company OR admin: show all application
routerApplication.get("/", requireAuth, hasRole(["company", "admin"]), ApplicationController.index);
// - all: show one application
routerApplication.get("/:id", requireAuth, ApplicationController.show);
// - company OR admin
routerApplication.get("/jobs/:jobId", requireAuth, hasRole(["company", "admin"]), ApplicationController.indexJob);
// - user: show applications
routerApplication.get("/users/:id", requireAuth, ApplicationController.indexUser);
// - user
routerApplication.post("/jobs/:jobId", requireAuth, hasRole(["user", "admin"]), ApplicationController.create);
// - company OR admin
routerApplication.put("/:id", requireAuth, hasRole(["company", "admin"]), ApplicationController.update);
// - company OR admin
routerApplication.delete("/:id", requireAuth, hasRole(["company", "admin"]), ApplicationController.delete);
