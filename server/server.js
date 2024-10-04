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
     "project_id": "proxy-199321",
     "private_key_id": "af9ee72803c7eb1c012a21f332da3e1e423533b6",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCbAABhB9Xba4QQ\nkH0zbtNk5U7FBFJj7hg4iRErHUXCfMn7YmUpWQXK6dDDcWqB6ZCT0+Uh8+XcwC9Q\nFAFZXUzsQmnqDb7zSDU7bfTV9SxvT7r6c/t3MqMOejjkoVU9vE38afPHhlwbmDla\n3UQjqulnJL56XX/iCpjuQ8m1g43ijOggV7BN0DiHtARdKPZZrf8F5DDsQdAvCcfn\n/ypMMFXaAEtd33oTJuE+tsZeCgiEwaylh1JDNfnTRUZ1I/seelJqDo+qFXF9d/Ay\nzr0DQuMvrn+wPUWQzAH5zwT67ZmJ9RESryGYBVwD6YBD+3/lOv95fqNpMj31X+v6\ni6KvJ7/VAgMBAAECggEAMV73v/Bp+yEtCMWtS5OyfAHabEDrKW9ugZuPP2dsj/2F\nrK/zvw7fHHoLiCV5InZOGfg1lPIGNqF0sJIet+NTHDIvYGEOgJlwc0Sb5wbYJ4CC\n80G8SIR1kaf2tUR6TVbMlGj/QH+YmSWMp1exW5cWD0eR8JIVqN9tRP+MoWeM6yst\ndEhGN3+UiNmTvF2lm8fKZCqytFs6zr+AXYZiAyPlkQ8PuZnxpLbubY9qELbYUcrw\nStJp1kxo+xW/k9anK+HYbg530hOTGig/T4rnQA1NgEkednfV79qwWyAMOdqGey6C\ndfKQHz+nRMuAOzopmKeiXqj26zhIQT+lUYTYFVG35QKBgQDYTs6rf7otRHCeluUI\nwaO0fY3yTfpln5fkHARToiVZCzNqAurrwyHDUyTGI0jfbimQBweronCVEPOj/pi0\nM/jomwcD/GMDxPEPxkxWMA8WFzx6k33Zim9P4XVWMza59OdJKPIJmCsgzZzH9JOt\nz0muIDt64qjaX/pQssyAJm3tnwKBgQC3cTijSeaPNmKgHM3Ro+TirHnrrgOJMdvI\nlXWja8hKQ7NG3Tv2jmjUVVUa5qcZpypEToHyxoPXht5vibWDJcyYypEbQ8wLeBpA\n2qhC9HRATbj6wTWjCud3cPLvX4Cdm7zPQNVjB5ftudpQTpdhbGW1yG03BMli4Mgc\nsdX/t1E2CwKBgG71LgrHQGeMHgEcAmzVd/ZUGYZb/cA3d6DpxkZofKQKnNsamAtM\nU3twoQKKgw0p42QgVwzyDLJKudA7/3Ug2+Pl8llXFCuQ0N94pxvnFzYLwVhXZE09\nOBBP5PLM3pvRRvs+Z7oINsdi8bOYgFC+bltF6X0F2/v5E9xle4WZMPadAoGBAKR6\nhjgS6QF72A6MBRd1hqKf12m0S0NWSyScri/rUlkUPsjJURyPL/tCz94g9a8Qrds1\nMVsHF+vF5+fGZ9PBrqNI7bauoWOfOprv83KlUR7fEX70gi1Ad64mvgxXazDmFPMX\nxLzYcCcdP1xGO4GE+eV2Yka0qgVYWtUvtxtjuRNlAoGBAMX/s2q9j9yWiwtEJLa/\n/R6XbMf01blM2vSaqsFfxng5kNzbYT1c5giRETyGXERPYkR9h93p02qXLP0PaRNC\nSk/LpvOgiHTdw8IHLluciq185V5pWzUHMVnpho0l7/GKCZTYOBqmjvHRs4cgURyl\nfQruTyq7S12vmlgkeFj/fEvp\n-----END PRIVATE KEY-----\n",
     "client_email": "mckit77@proxy-199321.iam.gserviceaccount.com",
     "client_id": "117306848315221002731",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mckit77%40proxy-199321.iam.gserviceaccount.com",
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