import { Router } from "express";
import { routerUser } from "./routes/user_route.js";
import { routerJob } from "./routes/job_routes.js";
import { routerCompany } from "./routes/company_routes.js";
import { routerApplication } from "./routes/application_routes.js";
import { routerConversation } from "./routes/conversations_routes.js";
import { routerMessage } from "./routes/message_route.js";
import { routerFavorite } from "./routes/favorites_routes.js";

export const routerApi = Router();

routerApi.get("/", async (req, res) => {
  res.status(200).send("Hello API");
});

routerApi.use("/users", routerUser);
routerApi.use("/jobs", routerJob);
routerApi.use("/companies", routerCompany);
routerApi.use("/applications", routerApplication);
routerApi.use("/conversations", routerConversation);
routerApi.use("/messages", routerMessage);
routerApi.use("/favorites", routerFavorite);
