import mongoose, { Schema, Document } from "mongoose";
export interface IWatched extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: number;
  title: string;
  summary: string;
  releaseDate: Date;
  genres: string[];
  cast: string[];
  rating: number;
  WatchedAt: Date;
  posterPath: string;
}

const watchedSchema: Schema<IWatched> = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  posterPath: { type: String, required: true },

  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genres: { type: [String], default: [] },
  cast: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 10 },
  WatchedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWatched>("Watched", watchedSchema);
