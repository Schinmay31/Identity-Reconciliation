import express, { NextFunction, Request, Response } from "express";
import ContactService from "./contact.service"; // your service function
import { identifyValidator } from "./contact.validator";

const router = express.Router();

router.post(
  "/identity",
  identifyValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, phoneNumber } = req.body || {};

      const identity = await ContactService.getIdentity(email, phoneNumber);

      return res.status(200).send(identity);
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
