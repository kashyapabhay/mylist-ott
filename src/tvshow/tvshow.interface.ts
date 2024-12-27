import { Genre } from "src/global.types";

export interface TVShow {
	id: string;
	title: string;
	description: string;
	genres: Genre[];
	episodes: Array<{
		episodeNumber: number;
		seasonNumber: number;
		releaseDate: Date;
		director: string;
		actors: string[];
	}>;
}
