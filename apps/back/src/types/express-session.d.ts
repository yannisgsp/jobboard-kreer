import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number; // ID de l'utilisateur connecté
    role?: string;
    flashMessage?: string; // si tu veux un message temporaire
  }
}
