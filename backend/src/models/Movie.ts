import mongoose, { Schema, Document } from "mongoose";
export interface IMovie extends Document {
  userId: string;
  movieId: string;
  title: string;
  summary: string;
  releaseDate: Date;
  posterPath: string;
  genres: string[];
  director: string;
  cast: string[];
  rating: number;
}

const movieSchema: Schema<IMovie> = new Schema({
  userId: { type: String, required: true },
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  posterPath: { type: String, default: "" },
  genres: { type: [String], default: [] },
  director: { type: String, required: true },
  cast: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 10 },
});

movieSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model<IMovie>("Movie", movieSchema);
