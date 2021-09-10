const express = require('express');
const bodyParser = require("body-parser");
const admin = require('firebase-admin');
const firebaseKeys = require('./firebaseKeys.json');

const moviesRoute = require('./routes/movies');

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys),
});
const db = admin.firestore();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET');
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  res.locals.db = db;
  next();
});

app.use('/movies', moviesRoute);

// Listen requests
app.listen(process.env.PORT || 5000, () => {
  console.log('\x1b[32m%s\x1b[0m', 'Express server on port 5000');
});