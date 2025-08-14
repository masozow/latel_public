import { UserTokenPayload } from "../utils/generateToken.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}
