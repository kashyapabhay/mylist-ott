import { Document } from 'mongoose';

export interface Item {
  contentId: string;
  contentType: string;
  dateAdded: Date;
}

export interface MyList extends Document {

  readonly _id: string;
  readonly userId: string;
  readonly items: Item[];
  readonly lastUpdated: Date;
  readonly createdOn: Date;
}
