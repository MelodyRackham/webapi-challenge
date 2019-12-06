const express = require('express');
const router = express.Router();
const actions = require('./actionModel');
const MAX_DESCRIPTION_LENGTH = 128;
router.use(express.json());

const validateID = (req, res, next) => {
  req.url.match(/[0-9]+/)
    ? actions
        .get(req.url.match(/[0-9]+/)[0])
        .then(action => {
          req.action = action;
          action ? next() : res.status(400).json({ error: 'Invalid action id' });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: 'Could not access actions' });
        })
    : next();
};
const validateAction = (req, res, next) => {
  req.method === 'PUT'
    ? !req.body.description || !req.body.notes
      ? res.status(400).json({ error: 'Action requires a description and notes!' })
      : req.body.description.length > MAX_DESCRIPTION_LENGTH
      ? res.status(400).json({ error: `Description cannot be longer than ${MAX_DESCRIPTION_LENGTH} characters` })
      : next()
    : next();
};

router.use(validateID);
router.use(validateAction);

router.get('/', (req, res) => {
  actions
    .get()
    .then(list => {
      res.status(200).json(list);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'There was an error fetching the actions' });
    });
});
router.get('/:id/', (req, res) => {
  res.status(200).json(req.action);
});
router.put('/:id/', (req, res) => {
  req.body.project_id = req.action.project_id;
  actions
    .update(req.params.id, req.body)
    .then(output => {
      res.status(201).json(output);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Unable to update action on server' });
    });
});
router.delete('/:id/', (req, res) => {
  actions
    .remove(req.params.id)
    .then(output => {
      res.status(200).json(output);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Unable to remove action from server' });
    });
});

module.exports = router;
