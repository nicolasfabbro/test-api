const express = require('express');
const app = express();
const { isValidBody } = require('../utils');

// POST
app.post('/', async (req, res) => {
  const { db } = res.locals;
  const { body } = req;

  if (isValidBody(body)) {
    const ref = db.collection('movies').doc();
    try {
      const newMovie = {
        name: req.body.name,
        gender: req.body.gender,
        year: req.body.year,
      };

      const response = await ref.set(newMovie);

      res.status(201).send({ status: 'created', data: newMovie });
    } catch (e) {
      res.status(500).send({ status: 'error', error: 'error_adding_movie' });
    }
  } else {
    res.status(400).send({ status: 'error', error: 'invalid_body' });
  }
});

// GET ALL
app.get('/', async (req, res) => {
  const { db } = res.locals;

  try {
    const snapshot = await db.collection('movies').get();
    const movies = [];

    snapshot.forEach((doc) => {
      movies.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  
    res.send(movies);
  } catch (e) {
    res.status(500).send({ status: 'error', error: 'error_getting_movies' });
  }
});

// GET BY ID
app.get('/:id', async (req, res) => {
  const { db } = res.locals;
  const { id } = req.params;

  try {
    const response = await db.collection('movies').doc(id).get();
    
    if (response.data()) {
      const movie = {
        id: response.id,
        ...response.data(),
      };
    
      res.send(movie);
    } else {
      res.status(404).send({ status: 'error', error: 'movie_not_found' });
    }
  } catch (e) {
    console.log('error', e);
    res.status(500).send({ status: 'error', error: 'error_getting_movie' });
  }
});

// UPDATE
app.put('/:id', async (req, res) => {
  const { db } = res.locals;
  const { id } = req.params;
  const { body } = req;

  if (isValidBody(body)) {
    try {
      const movieRef = db.collection('movies').doc(id);
      const response = await movieRef.update(body);

      res.send({ status: 'updated', movie_id: id });
    } catch (e) {
      if (e && e.code && e.code === 5) {
        res.status(404).send({ status: 'error', error: 'movie_not_found' });
      } else {
        res.status(500).send({ status: 'error', error: 'error_updating_movie' });
      }
    }
  } else {
    res.status(400).send({ status: 'error', error: 'invalid_body' });
  }
});

// DELETE
app.delete('/:id', async (req, res) => {
  const { db } = res.locals;
  const { id } = req.params;

  if (id) {
    try {
      const response = await db.collection('movies').doc(id).delete();

      res.send({ status: 'deleted', movie_id: id });
    } catch (e) {
      if (e && e.code && e.code === 5) {
        res.status(404).send({ status: 'error', error: 'movie_not_found' });
      } else {
        res.status(500).send({ status: 'error', error: 'error_deleting_movie' });
      }
    }
  } else {
    res.status(400).send({ status: 'error', error: 'id_not_provded' });
  }
});

module.exports = app;
