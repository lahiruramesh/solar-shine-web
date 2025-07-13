import { createRequire } from 'module';
import * as dotenv from 'dotenv';

dotenv.config();

const require = createRequire(import.meta.url);
const appwrite = require('appwrite');

console.log('Available in appwrite:', Object.keys(appwrite));
console.log('Client type:', typeof appwrite.Client);

const client = new appwrite.Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT!)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID!);

console.log('Client created successfully!');

const databases = new appwrite.Databases(client);
console.log('Databases created successfully!');

// Test a simple database operation
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID!;

try {
  const result = await databases.createDocument(DATABASE_ID, 'global_settings', appwrite.ID.unique(), {
    site_title: 'Test Site',
    site_description: 'This is a test',
  });
  console.log('Test document created:', result.$id);
} catch (error) {
  console.error('Error creating test document:', error);
}
