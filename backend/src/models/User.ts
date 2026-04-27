import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    favoriteGenres: string[];
    languages: string[];
  };
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: {
      favoriteGenres: { type: [String], default: [] },
      languages: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
