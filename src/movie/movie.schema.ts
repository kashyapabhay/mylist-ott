import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String, required: true }],
  releaseDate: { type: Date, required: false },
  director: { type: String, required: true },
  actors: [{ type: String, required: true }],
});




// Add a toJSON transformation to map _id to id
MovieSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});