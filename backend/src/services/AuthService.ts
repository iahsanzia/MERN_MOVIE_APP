import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../config/environment";

const env = getEnvironmentVariables();

class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: "7d" });
  }

  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as {
        userId: string;
        email: string;
      };
    } catch (error) {
      return null;
    }
  }
  validateEmaiil(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return {
        valid: false,
        message: "Password must be at least 6 characters long.",
      };
    }
    return { valid: true };
  }
}

export default new AuthService();
