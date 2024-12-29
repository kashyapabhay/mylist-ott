const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/tvshows';

const csvWriter = createCsvWriter({
  path: 'tvshows.csv',
  header: [
    { id: 'id', title: 'id' },
    { id: 'title', title: 'title' },
    { id: 'description', title: 'description' },
    { id: 'genres', title: 'genres' },
    { id: 'episodes', title: 'episodes' },
  ],
});



async function createTVShow(tvShow) {
  try {
    const response = await axios.post(API_URL, tvShow);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log(`TV Show created with ID: ${response.data.id}`);
    console.log('Response JSON:', responseData);
    return response.data;
  } catch (error) {
    console.error(`Error creating TV show: ${error.message}`);
    return null;
  }
}

async function createTVShows(count) {
  console.log('Creating TV shows and saving to CSV...');
  const tvShows = [];
  for (let i = 0; i < count; i++) {
    const tvShow = {
      title: `TV Show Title ${i}`,
      description: `Description for TV show ${i}`,
      genres: ['Drama', 'Comedy'],
      episodes: [
        {
          episodeNumber: 1,
          seasonNumber: 1,
          releaseDate: new Date().toISOString(),
          director: `Director ${i}`,
          actors: [`Actor ${i}A`, `Actor ${i}B`],
        },
      ],
    };

    const createdTVShow = await createTVShow(tvShow);
    if (createdTVShow) {
      tvShows.push({
        id: createdTVShow.id,
        title: createdTVShow.title,
        description: createdTVShow.description,
        genres: createdTVShow.genres.join(', '),
        episodes: createdTVShow.episodes.map(episode => `S${episode.seasonNumber}E${episode.episodeNumber}`).join(', '),
      });
    }
  }

  await csvWriter.writeRecords(tvShows);
  console.log('Finished creating TV shows and saving to CSV');
}

createTVShows(100).then(() => {
  console.log('Script execution completed');
});