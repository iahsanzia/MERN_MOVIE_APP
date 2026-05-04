import { UserRepository } from "../repositories";
import { IUser } from "../models";
import { AuthService } from "./index";

class UserService {
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<{ user: IUser; token: string }> {
    if (!AuthService.validateEmaiil(email)) {
      throw new Error("Invalid email format.");
    }

    const passwordValidation = AuthService.validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    const existingEmail = await UserRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error("Email already in use.");
    }

    const existingUsername = await UserRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error("Username already in use.");
    }

    const hashedPassword = await AuthService.hashPassword(password);

    const user = await UserRepository.create({
      username,
      email,
      password: hashedPassword,
      preferences: {
        favoriteGenres: [],
        languages: [],
      },
    });

    const token = AuthService.generateToken(user._id.toString(), user.email);

    return { user, token };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: IUser; token: string }> {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await AuthService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const token = AuthService.generateToken(user._id.toString(), user.email);

    return { user, token };
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserRepository.findById(id);
  }

  async updatePreferences(
    userId: string,
    favoriteGenres: string[],
    languages: string[],
  ): Promise<IUser | null> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const updatedData: Partial<IUser> = {
      preferences: {
        favoriteGenres: favoriteGenres || user.preferences.favoriteGenres,
        languages: languages || user.preferences.languages,
      },
    };

    return await UserRepository.update(userId, updatedData);
  }

  async updateProfile(
    userId: string,
    username?: string,
    email?: string,
    password?: string,
  ): Promise<IUser | null> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (email && email !== user.email) {
      const existingEmail = await UserRepository.findByEmail(email);
      if (existingEmail) {
        throw new Error("Email already in use.");
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await UserRepository.findByUsername(username);
      if (existingUsername) {
        throw new Error("Username already in use.");
      }
    }

    const updatedData: Partial<IUser> = {};

    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (password) {
      const hashedPassword = await AuthService.hashPassword(password);
      updatedData.password = hashedPassword;
    }
    return await UserRepository.update(userId, updatedData);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await UserRepository.delete(userId);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await UserRepository.findAll();
  }
}

export default new UserService();
