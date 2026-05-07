import { User, IUser } from "../models";
import mongoose from "mongoose";

class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
  async findById(id: string): Promise<IUser | null> {
    try {
      // Check if id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await User.findById(id);
    } catch (error) {
      return null;
    }
  }
  async findAll(): Promise<IUser[]> {
    return await User.find();
  }
  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }
  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        returnDocument: "after",
      });
    } catch (error) {
      return null;
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
      }
      const result = await User.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      return false;
    }
  }
}

export default new UserRepository();
