import { Router } from "express";
import JobController from "../controllers/job_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import { hasRole } from "../middleware/role_middleware.js";

export const routerJob = Router();

// PUBLIC
routerJob.get("/", JobController.index);

routerJob.get("/company", requireAuth, hasRole(["company", "admin"]), JobController.getByCompanyId);

routerJob.get("/:id", JobController.show);

// AUTHENTICATED
// - company OR admin
routerJob.post("/", requireAuth, hasRole(["company", "admin"]), JobController.create);
// - company owner OR admin
routerJob.put("/:id", requireAuth, hasRole(["company", "admin"]), JobController.update);
routerJob.delete("/:id", requireAuth, hasRole(["company", "admin"]), JobController.delete);

// - company OR admin
// - Users who applied for a job
routerJob.get("/:id/applicants", requireAuth, hasRole(["company", "admin"]), JobController.showUsersByApplication);
