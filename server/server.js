const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { Storage } = require('@google-cloud/storage'); // Import the Google Cloud Storage library
const { uploadMiddleware } = require('./utils/upload');
const multer = require('multer'); // Import multer for file uploads
const cors = require('cors');

require('dotenv').config();


const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve up static assets
  app.use('/images', express.static(path.join(__dirname, '../client/images')));

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  const storage = new Storage({
    credentials: {
      "type": "service_account",
      "project_id": `${process.env.PROJECT_ID}`,
      "private_key_id": `${process.env.PRIVATE_KEY_ID}`,
      "private_key": `${process.env.PRIVATE_KEY}`,
      "client_email": `${process.env.CLIENT_EMAIL}`,
      "client_id": `${process.env.CLIENT_ID}`,
      "auth_uri": `${process.env.AUTH_URL}`,
      "token_uri": `${process.env.TOKEN_URL}`,
      "auth_provider_x509_cert_url": `${process.env.AUTH_PROVIDER_X509_CERT_URL}`,
      "client_x509_cert_url": `${process.env.CLIENT_X509_CERT_URL}`,
      "universe_domain": "googleapis.com"
    }
  });

  const bucketName = 'uploads_bucket_instaclip'; // Replace with your GCS bucket name // Replace with your GCS bucket name
  const bucket = storage.bucket(bucketName);

  // Set up multer for file uploads
  const multerStorage = multer.memoryStorage(); // Store files in memory for processing
  const multerMiddleware = multer({
    storage: multerStorage,
    fileFilter: (req, file, callback) => {
      // Define file filtering logic here, if needed
      callback(null, true);
    },
  });

  // Route for handling file uploads
  app.post('/upload', multerMiddleware.single('file'), (req, res) => {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('File upload to GCS failed');
    });

    blobStream.on('finish', async () => {
      // Generate a public URL for the uploaded file
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      res.json({ publicUrl }); // Return the public URL to the client
    });

    blobStream.end(req.file.buffer);
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    const hostname = process.env.HOSTNAME || 'localhost'; // Use 'localhost' as the default value for local development
    const serverUrl = `http://${hostname}:${PORT}`;
    console.log(`API server running at ${serverUrl}`);
    console.log(`Use GraphQL at ${serverUrl}/graphql`);
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at ${serverUrl}/graphql`);
      console.log(process.env.CREDENTIALS);
    });
  });
};

// Call the async function to start the server
startApolloServer();