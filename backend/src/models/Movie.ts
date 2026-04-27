import mongoose, { Schema, Document } from "mongoose";
export interface IMovie extends Document {
  movieId: string;
  title: string;
  summary: string;
  releaseDate: Date;
  genres: string[];
  director: string;
  cast: string[];
  rating: number;
}

const movieSchema: Schema<IMovie> = new Schema({
  movieId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genres: { type: [String], default: [] },
  director: { type: String, required: true },
  cast: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 10 },
});

export default mongoose.model<IMovie>("Movie", movieSchema);
