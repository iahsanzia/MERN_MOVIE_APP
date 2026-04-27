import mongoose, { Schema, Document } from "mongoose";
export interface IWatched extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: number;
  title: string;
  description: string;
  releaseDate: Date;
  genres: string[];
  director: string;
  cast: string[];
  rating: number;
  WatchedAt: Date;
}

const watchedSchema: Schema<IWatched> = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genres: { type: [String], default: [] },
  director: { type: String, required: true },
  cast: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 10 },
  WatchedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWatched>("Watched", watchedSchema);
