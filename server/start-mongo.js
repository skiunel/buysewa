/**
 * Starts a persistent MongoDB instance using mongodb-memory-server.
 * This downloads a real mongod binary and runs it on port 27017.
 * Data is stored in /tmp/buysewa-mongo-data so it persists while the process runs.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create({
  instance: {
    port: 27017,
    dbName: 'buysewa_reviews',
    storageEngine: 'wiredTiger',
  },
});

const uri = mongod.getUri();
console.log('MongoDB started at:', uri);
console.log('Press Ctrl+C to stop');

process.on('SIGINT', async () => {
  await mongod.stop();
  process.exit(0);
});

// Keep process alive
await new Promise(() => {});
