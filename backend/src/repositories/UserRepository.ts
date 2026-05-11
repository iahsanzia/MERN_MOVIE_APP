import { User, IUser } from "../models";
import mongoose from "mongoose";

class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }
  async findByEmail(email: string): Promise<IUser | null> {
    // Email is already stored in lowercase in schema with lowercase: true
    return await User.findOne({ email });
  }
  async findById(id: string): Promise<IUser | null> {
    try {
      // Check if id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Invalid ObjectId:", id);
        return null;
      }
      const user = await User.findById(id);
      console.log("findById result for", id, ":", user ? "found" : "not found");
      return user;
    } catch (error) {
      console.log("findById error:", error);
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
    console.log("update() called with id:", id, "updateData:", updateData);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId in update");
      return null;
    }
    console.log("Calling findByIdAndUpdate...");
    const result = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    console.log(
      "findByIdAndUpdate result:",
      result ? "got result" : "null/undefined",
    );
    return result;
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
