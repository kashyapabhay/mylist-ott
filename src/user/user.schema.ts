import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  preferences: {
    favoriteGenres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] }],
    dislikedGenres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] }],
  },
  watchHistory: [
    {
      contentId: { type: String, required: true },
      watchedOn: { type: Date, required: true },
      rating: { type: Number },
    },
  ],
});

// Add a toJSON transformation to map _id to id
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});