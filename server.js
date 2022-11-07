// requirements to use npm packages
const express = require('express');
const session = require('express-session');
const routes = require('./controllers');

// set up sequelize and saving session data
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express(); // use express
const PORT = process.env.PORT || 3001; // set up what port to listen to

// set up our session
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true, // save session data even if completely unmodified
  // saves session data to the database
  store: new SequelizeStore({
    db: sequelize
  })
};

//use session
app.use(session(sess));

// allow requests using both JSON objects and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use routes for modularity
app.use(routes);

// set up sequelize to listen on our chosen port
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
