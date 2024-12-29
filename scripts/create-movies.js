const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/movies';

const csvWriter = createCsvWriter({
  path: 'movies.csv',
  header: [
    { id: 'id', title: 'ID' },
    { id: 'title', title: 'Title' },
    { id: 'description', title: 'Description' },
    { id: 'genres', title: 'Genres' },
    { id: 'releaseDate', title: 'Release Date' },
    { id: 'director', title: 'Director' },
    { id: 'actors', title: 'Actors' },
  ],
});
async function createMovie(movie) {
  try {
    const response = await axios.post(API_URL, movie);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log(`Movie created with ID: ${response.data.id}`);
    console.log('Response JSON:', responseData);
    return response.data;
  } catch (error) {
    console.error(`Error creating movie: ${error.message}`);
    return null;
  }
}

async function createMovies(count) {
  console.log('Creating movies and saving to CSV...');
  const movies = [];
  for (let i = 0; i < count; i++) {
    const movie = {
      title: `Movie Title ${i}`,
      description: `Description for movie ${i}`,
      genres: ['Action', 'Drama'],
      releaseDate: new Date().toISOString(),
      director: `Director ${i}`,
      actors: [`Actor ${i}A`, `Actor ${i}B`],
    };

    const createdMovie = await createMovie(movie);
    if (createdMovie) {
      movies.push({
        id: createdMovie.id,
        title: createdMovie.title,
        description: createdMovie.description,
        genres: createdMovie.genres.join(', '),
        releaseDate: createdMovie.releaseDate,
        director: createdMovie.director,
        actors: createdMovie.actors.join(', '),
      });
    }
  }

  await csvWriter.writeRecords(movies);
  console.log('Finished creating movies and saving to CSV');
}

createMovies(100).then(() => {
  console.log('Script execution completed');
});
