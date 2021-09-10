const express = require('express');
const app = express();

// POST
app.post('/', async (req, res) => {
  const { db } = res.locals;
  const { body } = req;

  if (body && body.name) {
    const ref = db.collection('categories').doc();
    try {
      const newCategory = {
        name: req.body.name,
      };

      const response = await ref.set(newCategory);

      res.status(201).send({ status: 'created', data: newCategory });
    } catch (e) {
      res.status(500).send({ status: 'error', error: 'error_adding_category' });
    }
  } else {
    res.status(400).send({ status: 'error', error: 'invalid_body' });
  }
});

// GET ALL
app.get('/', async (req, res) => {
  const { db } = res.locals;

  try {
    const snapshot = await db.collection('categories').get();
    const categories = [];

    snapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  
    res.send({ categories });
  } catch (e) {
    res.status(500).send({ status: 'error', error: 'error_getting_categories' });
  }
});

// GET BY ID
app.get('/:id', async (req, res) => {
  const { db } = res.locals;
  const { id } = req.params;

  try {
    const response = await db.collection('categories').doc(id).get();
    
    if (response.data()) {
      const category = {
        id: response.id,
        ...response.data(),
      };
    
      res.send(category);
    } else {
      res.status(404).send({ status: 'error', error: 'category_not_found' });
    }
  } catch (e) {
    console.log('error', e);
    res.status(500).send({ status: 'error', error: 'error_getting_category' });
  }
});

// UPDATE
app.put('/:id', async (req, res) => {
  const { db } = res.locals;
  const { id } = req.params;
  const { body } = req;

  if (body && body.name) {
    try {
      const categoryRef = db.collection('categories').doc(id);
      const response = await categoryRef.update(body);

      res.send({ status: 'updated', category_id: id });
    } catch (e) {
      if (e && e.code && e.code === 5) {
        res.status(404).send({ status: 'error', error: 'category_not_found' });
      } else {
        res.status(500).send({ status: 'error', error: 'error_updating_category' });
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
      const response = await db.collection('categories').doc(id).delete();

      res.send({ status: 'deleted', category_id: id });
    } catch (e) {
      if (e && e.code && e.code === 5) {
        res.status(404).send({ status: 'error', error: 'category_not_found' });
      } else {
        res.status(500).send({ status: 'error', error: 'error_deleting_category' });
      }
    }
  } else {
    res.status(400).send({ status: 'error', error: 'id_not_provded' });
  }
});

module.exports = app;
