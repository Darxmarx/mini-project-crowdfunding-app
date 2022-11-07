// set up router and require Project model in the 'models' folder
const router = require('express').Router();
const { Project } = require('../../models');

// POST method to create a brand new project
router.post('/', async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user_id: req.session.user_id, // user id matches whatever user is currently logged in
    });

    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE method to delete a specific project by its id
router.delete('/:id', async (req, res) => {
  try {
    // delete the data from the Project model that matches the given id belonging to the given user
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    // if there is no project data associated with the given id, return a 400 error
    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
