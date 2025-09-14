import { Router, Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/middlewares/error-handler.middleware";
import contactRoutes from "./contact/contact.route";


const router = Router();

// contact routes
router.use("/",contactRoutes)


router.use(errorHandler);

export { router };