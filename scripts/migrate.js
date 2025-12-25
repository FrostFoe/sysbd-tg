const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Helper to parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*["']?([^"]*)["']?\s*$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const instance = axios.create({
  baseURL: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    'X-Appwrite-Key': env.APPWRITE_API_KEY,
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const DATABASE_ID = 'chat_db';

async function setup() {
  try {
    console.log('Starting migration...');

    // 1. Create Database
    try {
      await instance.post('/databases', {
        databaseId: DATABASE_ID,
        name: 'Chat Application'
      });
      console.log('Database created.');
    } catch (e) {
      if (e.response && e.response.status === 409) console.log('Database already exists.');
      else throw e;
    }

    // 2. Create Storage Bucket
    try {
      await instance.post('/storage/buckets', {
        bucketId: 'media',
        name: 'Media Storage',
        permissions: ['read("any")', 'create("any")', 'update("any")', 'delete("any")'],
        fileSecurity: false
      });
      console.log('Storage bucket "media" created.');
    } catch (e) {
      if (e.response && e.response.status === 409) console.log('Storage bucket already exists.');
      else throw e;
    }

    // 3. Collections
    const collections = [
      {
        id: 'profiles',
        name: 'Profiles',
        attributes: [
          { key: 'userId', type: 'string', size: 255, required: true },
          { key: 'username', type: 'string', size: 255, required: true },
          { key: 'avatar', type: 'string', size: 500, required: false },
          { key: 'createdAt', type: 'datetime', required: true },
        ]
      },
      {
        id: 'chats',
        name: 'Chats',
        attributes: [
          { key: 'type', type: 'string', size: 50, required: true },
          { key: 'members', type: 'string', size: 255, required: true, array: true },
          { key: 'name', type: 'string', size: 255, required: false },
          { key: 'isArchived', type: 'boolean', required: false, default: false },
          { key: 'lastMessage', type: 'string', size: 500, required: false },
          { key: 'createdAt', type: 'datetime', required: true },
        ]
      },
      {
        id: 'messages',
        name: 'Messages',
        attributes: [
          { key: 'chatId', type: 'string', size: 255, required: true },
          { key: 'senderId', type: 'string', size: 255, required: true },
          { key: 'type', type: 'string', size: 50, required: true },
          { key: 'text', type: 'string', size: 2000, required: false },
          { key: 'fileId', type: 'string', size: 255, required: false },
          { key: 'fileUrl', type: 'string', size: 500, required: false },
          { key: 'isPinned', type: 'boolean', required: false, default: false },
          { key: 'isEdited', type: 'boolean', required: false, default: false },
          { key: 'isForwarded', type: 'boolean', required: false, default: false },
          { key: 'isScheduled', type: 'boolean', required: false, default: false },
          { key: 'replyToId', type: 'string', size: 255, required: false },
          { key: 'replyToText', type: 'string', size: 255, required: false },
          { key: 'selfDestructTime', type: 'integer', required: false },
          { key: 'expiresAt', type: 'string', size: 50, required: false }, 
          { key: 'views', type: 'integer', required: false, default: 0 },
          { key: 'reactions', type: 'string', size: 500, required: false }, 
          { key: 'question', type: 'string', size: 255, required: false },
          { key: 'options', type: 'string', size: 1000, required: false }, 
          { key: 'gameState', type: 'string', size: 1000, required: false }, 
          { key: 'createdAt', type: 'datetime', required: true },
        ]
      }
    ];

    for (const col of collections) {
      try {
        await instance.post(`/databases/${DATABASE_ID}/collections`, {
          collectionId: col.id,
          name: col.name,
          permissions: ['read("any")', 'create("any")', 'update("any")', 'delete("any")'],
          documentSecurity: false
        });
        console.log(`Collection "${col.name}" created.`);
      } catch (e) {
        if (e.response && e.response.status === 409) {
            console.log(`Collection "${col.name}" already exists.`);
        } else {
            throw e;
        }
      }

      // Add attributes
      for (const attr of col.attributes) {
        try {
          let endpoint = '';
          const payload = {
            key: attr.key,
            required: attr.required,
            array: attr.array || false
          };

          if (attr.type === 'string') {
            endpoint = 'string';
            payload.size = attr.size;
          } else if (attr.type === 'datetime') {
            endpoint = 'datetime';
          } else if (attr.type === 'boolean') {
            endpoint = 'boolean';
            payload.default = attr.default || false;
          } else if (attr.type === 'integer') {
            endpoint = 'integer';
            payload.default = attr.default || 0;
          }

          await instance.post(`/databases/${DATABASE_ID}/collections/${col.id}/attributes/${endpoint}`, payload);
          console.log(`Attribute "${attr.key}" added to "${col.name}".`);
          await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
          if (e.response && e.response.status === 409) {
            // console.log(`Attribute "${attr.key}" already exists.`);
          } else {
            console.error(`Error adding attribute ${attr.key}:`, e.response ? e.response.data : e.message);
          }
        }
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.response ? error.response.data : error.message);
  }
}

setup();
