import type { JwtPayload } from "../auth/types/auth.type";

declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}
