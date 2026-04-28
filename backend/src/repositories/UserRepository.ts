import { User, IUser } from "../models";

class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }
  async findAll(): Promise<IUser[]> {
    return await User.find();
  }
  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }
  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);

    return result !== null;
  }
}

export default new UserRepository();
