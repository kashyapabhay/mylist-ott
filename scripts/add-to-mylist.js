const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { ConsoleLogger } = require('@nestjs/common');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const API_URL = 'http://localhost:3000/mylist/';

const csvWriter = createCsvWriter({
  path: 'mylist.csv',
  header: [
    { id: 'userId', title: 'User ID' },
    { id: 'contentId', title: 'Content ID' },
    { id: 'contentType', title: 'Content Type' },
  ],
});


async function addToMylist(mylistItem) {
  try {
    const response = await axios.post(API_URL, mylistItem);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log(`Added to MyList: ${response.data.id}`);
    console.log('Response JSON:', responseData);
    return response.data;
  } catch (error) {
    console.error(`Error adding to MyList: ${error.message}`);
    return null;
  }
}

function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function generateMylistData() {
  console.log('Generating MyList data...');

  const users = await readCsv(path.join(__dirname, 'users.csv'));
  const movies = await readCsv(path.join(__dirname, 'movies.csv'));
  const tvshows = await readCsv(path.join(__dirname, 'tvshows.csv'));

  console.log('Users:', users.length);
  console.log('Movies:', movies.length);
  console.log('Tv showss:', tvshows.length);
  const mylistItems = [];
  for (let i = 0; i < 100; i++) {
    const user = users[i % users.length];
    console.log(`User id : ${user.id}`);
    const contentType = i % 2 === 0 ? 'Movie' : 'TVShow';
    const content = contentType === 'Movie'
      ? movies[i % movies.length]
      : tvshows[i % tvshows.length];
    console.log(`Adding to MyList: User ID ${user.id}, Content ID ${content.id}, Content Type ${contentType}`);
    const mylistItem = {
      userId: user.id,
      contentId: content.id,
      contentType: contentType,
    };

    const addedItem = await addToMylist(mylistItem);
    if (addedItem) {
      mylistItems.push(mylistItem);
    }
  }

  await csvWriter.writeRecords(mylistItems);
  console.log('Finished generating MyList data and saving to CSV');
}

generateMylistData().then(() => {
  console.log('Script execution completed');
});