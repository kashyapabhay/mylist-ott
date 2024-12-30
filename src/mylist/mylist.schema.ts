import { Schema } from 'mongoose';

const ItemSchema = new Schema({
  contentId: { type: String, required: true },
  contentType: { type: String, enum: ['Movie', 'TVShow'], required: true },
  dateAdded: { type: Date, default: Date.now, required: false },
});

export const MyListSchema = new Schema({
  userId: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
});

// Create a compound unique index on userId and items.contentId to ensure uniqueness
MyListSchema.index({ userId: 1, 'items.contentId': 1 }, { unique: true });

// Create an index on userId for efficient querying
MyListSchema.index({ userId: 1 });
