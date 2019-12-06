const express = require('express');
const router = express.Router();
const projects = require('./projectModel');
const actions = require('./actionModel');
const MAX_DESCRIPTION_LENGTH = 128;
router.use(express.json());

const validateID = (req, res, next) => {
  req.url.match(/[0-9]+/)
    ? projects
        .get(req.url.match(/[0-9]+/)[0])
        .then(project => {
          req.project = project;
          project ? next() : res.status(400).json({ error: 'Invalid project id' });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: 'Could not access projects' });
        })
    : next();
};
const validateProject = (req, res, next) => {
  (req.method === 'POST' || req.method === 'PUT') && !req.url.includes('actions')
    ? !req.body.name || !req.body.description
      ? res.status(400).json({ error: 'Project requires a name and description!' })
      : next()
    : next();
};
const validateAction = (req, res, next) => {
  (req.method === 'POST' || req.method === 'PUT') && req.url.includes('actions')
    ? !req.body.description || !req.body.notes
      ? res.status(400).json({ error: 'Action requires a description and notes!' })
      : req.body.description.length > MAX_DESCRIPTION_LENGTH
      ? res.status(400).json({ error: `Description cannot be longer than ${MAX_DESCRIPTION_LENGTH} characters` })
      : next()
    : next();
};

router.use(validateID);
router.use(validateProject);
router.use(validateAction);

router.get('/', (req, res) => {
  projects
    .get()
    .then(list => {
      res.status(200).json(list);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'There was an error fetching the projects' });
    });
});
router.get('/:id/', (req, res) => {
  res.status(200).json(req.project);
});
router.get('/:id/actions/', (req, res) => {
  projects
    .getProjectActions(req.params.id)
    .then(list => {
      res.status(200).json(list);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Unable to access project's actions" });
    });
});
router.post('/', (req, res) => {
  projects
    .insert(req.body)
    .then(output => {
      res.status(201).json(output);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Unable to add project to server' });
    });
});
router.post('/:id/actions/', (req, res) => {
  req.body.project_id = req.params.id;
  actions
    .insert(req.body)
    .then(output => {
      res.status(201).json(output);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Unable to add action to server' });
    });
});
router.put('/:id', (req, res) => {
  projects
    .update(req.params.id, req.body)
    .then(output => {
      res.status(201).json(output);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Unable to update project on server' });
    });
});
router.delete('/:id', (req, res) => {
  projects
    .remove(req.params.id)
    .then(output => {
      res.status(200).json(output);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Unable to remove project from server' });
    });
});

module.exports = router;
