const { MongoClient } = require('mongodb');

// Connection URL with user and password
const user = 'dev';
const password = 'terminator_89';
const url = `mongodb+srv://${user}:${password}@learning.y1x76.mongodb.net/test`;

// Database Name
const dbName = 'test';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function testConnection() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to MongoDB server');

    // Select the database
    const db = client.db(dbName);

    // Perform a simple operation (e.g., list collections)
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    // Close the connection
    await client.close();
  }
}

testConnection();