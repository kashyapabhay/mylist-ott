import { Document } from 'mongoose';
import { Schema, model } from 'mongoose';
import { TVShow } from './tvshow.interface';


const EpisodeSchema = new Schema({
  episodeNumber: { type: Number, required: true },
  seasonNumber: { type: Number, required: true },
  releaseDate: { type: Date, required: false },
  director: { type: String, required: true },
  actors: { type: [String], required: true }
});

export const TVShowSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: { type: [String], required: true },
  episodes: { type: [EpisodeSchema], required: true }
});

export const TVShowModel = model<TVShow & Document>('TVShow', TVShowSchema);


// Add a toJSON transformation to map _id to id
TVShowSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});