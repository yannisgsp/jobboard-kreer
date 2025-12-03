import { Request, Response, NextFunction } from "express";

export function hasRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.session?.userId;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.session.role!)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
