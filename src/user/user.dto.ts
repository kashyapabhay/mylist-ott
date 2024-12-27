import { Genre } from "src/global.types";

export class CreateUserDto {
  
  readonly username!: string;
  readonly preferences!: {
    favoriteGenres: Genre[];
    dislikedGenres: Genre[];
  };
  readonly watchHistory!: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}

export class UpdateUserDto {
  readonly username?: string;
  readonly preferences?: {
    favoriteGenres?: Genre[];
    dislikedGenres?: Genre[];
  };
  readonly watchHistory?: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}

