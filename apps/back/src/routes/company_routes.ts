import { Router } from "express";
import CompanyController from "../controllers/company_controller.js";
import { hasRole } from "../middleware/role_middleware.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import { upload } from "../middleware/upload.js";

export const routerCompany = Router();

// PUBLIC
routerCompany.get("/", CompanyController.index);
routerCompany.get("/profile", CompanyController.show);

// AUTHENTICATED
// - company owner OR admin
routerCompany.post("/new", requireAuth, hasRole(["company", "admin"]), upload.single("logo"), CompanyController.create);
routerCompany.put("/:id", requireAuth, hasRole(["company", "admin"]), upload.single("logo"), CompanyController.update);
routerCompany.delete("/:id", requireAuth, hasRole(["company", "admin"]), CompanyController.delete);
