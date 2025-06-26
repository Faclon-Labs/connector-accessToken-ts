import { MongoCRUD, MongoConfig } from './pubsub/mongo_crud.js';
import { WithId, UpdateFilter, ObjectId } from 'mongodb';

// Define a sample interface for user configuration (adjust fields as needed)
interface UserConfiguration {
  // Define fields based on your collection's schema
  [key: string]: any;
}

// MongoDB config from user
const config: MongoConfig = {
  uri: 'mongodb://admin:pass@10.0.39.188:27017/',
  dbName: 'insights_db',
  collectionName: 'user_configurations',
};

const crud = new MongoCRUD<UserConfiguration>(config);

async function run() {
  try {
    // Read the first document where languageSelected is 'Albanian'
    const docs: WithId<UserConfiguration>[] = await crud.read({ languageSelected: 'Albanian' });
    if (docs.length === 0) {
      console.log('No documents found with languageSelected = "Albanian".');
      return;
    }
    const firstDoc = docs[0];
    console.log('First document with languageSelected = "Albanian":', firstDoc);
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await crud.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run(); 