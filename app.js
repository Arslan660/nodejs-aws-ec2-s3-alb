const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const PORT = 3000;

const s3 = new AWS.S3();
const BUCKET_NAME = 'arslan-node-app-bucket-2026';


app.get('/', (req, res) => {
  res.send('<h1>Node.js App Running on EC2!</h1><p>Hostname: ' + require('os').hostname() + '</p>');
});

app.get('/list-files', async (req, res) => {
  try {
    const data = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
    res.json(data.Contents);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
