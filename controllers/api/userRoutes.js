// set up router, connect to the User model in the 'models' folder
const router = require('express').Router();
const { User } = require('../../models');

// POST method that allows user to create an account
router.post('/', async (req, res) => {
  try {
    // creates a user, and...
    const userData = await User.create(req.body);

    // saves session so that user is immediately logged in after creating own user details
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true; // automatically logs in

      res.status(200).json(userData);
    });
  } catch (err) { // error if user inputs invalid credentials
    res.status(400).json(err);
  }
});

// POST method that allows user to login to already existing account
router.post('/login', async (req, res) => {
  try {
    // checks database for user's inputted email (should only be one instance of said email)
    const userData = await User.findOne({ where: { email: req.body.email } });

    // if user email does not match anything in the database, return a 400 error
    if (!userData) {
      res
        .status(400)
        // for security purposes, website does not state if specifically the user email or the password is the incorrect element
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // checks for password to see if it matches a hashed password in the database
    const validPassword = await userData.checkPassword(req.body.password);

    // if password does not match anything in the database, return a 400 error
    if (!validPassword) {
      res
        .status(400)
        // for security purposes, website does not state if specifically the user email or the password is the incorrect element
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // if both user email and password are valid, save that the user is logged in to the session
    req.session.save(() => {
      req.session.user_id = userData.id; // saves the user id for duration of session
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// POST method for logging out of the session
router.post('/logout', (req, res) => {
  // first checks to make sure that the user is logged in
  if (req.session.logged_in) {
    // upon logging out, destroy the active session
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
