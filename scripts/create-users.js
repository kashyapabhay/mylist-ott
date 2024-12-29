const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/users';

const csvWriter = createCsvWriter({
  path: 'users.csv',
  header: [
    { id: 'id', title: 'id' },
    { id: 'username', title: 'username' },
    { id: 'favoriteGenres', title: 'favourite_genres' },
    { id: 'dislikedGenres', title: 'disliked_generes' },
    { id: 'contentId', title: 'content_id' },
    { id: 'watchedOn', title: 'watched_on' },
    { id: 'rating', title: 'rating' },
  ],
});



async function createUser(user) {
  try {
    const response = await axios.post(API_URL, user);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log(`User created with ID: ${response.data.id}`);
    console.log('Response JSON:', responseData);
    return response.data;
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    return null;
  }
}

async function createUsers(count) {
  console.log('Creating users and saving to CSV...');
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = {
      username: `user${i}`,
      preferences: {
        favoriteGenres: ['Action', 'Comedy'],
        dislikedGenres: ['Horror', 'Drama'],
      },
      watchHistory: [
        {
          contentId: `content${i}`,
          watchedOn: new Date().toISOString(),
          rating: Math.floor(Math.random() * 5) + 1,
        },
      ],
    };

    const createdUser = await createUser(user);
    if (createdUser) {
      users.push({
        id: createdUser.id,
        username: createdUser.username,
        favoriteGenres: createdUser.preferences.favoriteGenres.join(', '),
        dislikedGenres: createdUser.preferences.dislikedGenres.join(', '),
        contentId: createdUser.watchHistory[0].contentId,
        watchedOn: createdUser.watchHistory[0].watchedOn,
        rating: createdUser.watchHistory[0].rating,
      });
    }
  }

  await csvWriter.writeRecords(users);
  console.log('Finished creating users and saving to CSV');
}

createUsers(100).then(() => {
  console.log('Script execution completed');
});