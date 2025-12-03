import { Router } from "express";
import { FavoriteController } from "../controllers/favorites_controllers.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import { hasRole } from "../middleware/role_middleware.js";

export const routerFavorite = Router();

// AUTHENTICATE

// - user: add favorite
routerFavorite.post("/", requireAuth, hasRole(["user"]), FavoriteController.add);
// - user OR admin: show all
routerFavorite.get("/user/:id", requireAuth, hasRole(["user", "admin"]), FavoriteController.indexUser);
routerFavorite.delete("/:id", requireAuth, hasRole(["user", "admin"]), FavoriteController.delete);
// - admin
routerFavorite.get("/", requireAuth, hasRole(["admin"]), FavoriteController.index);
