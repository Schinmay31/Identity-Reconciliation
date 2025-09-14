import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/errors/error";
import { ERROR_CODES } from "../../utils/errors/error.constant";

 export const identifyValidator = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = validateIdentify(req.body); // validated payload replaces body
    next();
  } catch (err) {
    next(err); // pass to error middleware
  }
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{7,14}$/;

const validateIdentify = (payload: { email?: string; phoneNumber?: string }) => {
  payload.email = payload?.email?.toLowerCase().trim()
  payload.phoneNumber = payload?.phoneNumber?.trim()
  
  if (!payload.email && !payload.phoneNumber) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR,"Either email or phoneNumber must be provided");
  }

  if (payload.email) {
    if (payload.email.length > 255) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Email must not exceed 255 characters"
      );
    }

    if (!emailRegex.test(payload.email)) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid email format"
      );
    }
  }
  
  if (payload.phoneNumber && !phoneRegex.test(payload.phoneNumber)) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR,"Invalid phone number format");
  }

  return payload;
};
