import mongoose, { Schema, Document } from "mongoose";
export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  rating: number;
  addedAt: Date;
  summary?: string;
}

const favoriteSchema: Schema<IFavorite> = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    posterPath: { type: String, required: true },
    releaseDate: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10 },
    addedAt: { type: Date, default: Date.now },
    summary: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IFavorite>("Favorite", favoriteSchema);
