// require specific models
const User = require('./User');
const Project = require('./Project');

// one-to-many association
User.hasMany(Project, {
  foreignKey: 'user_id',
  // if the User is deleted, all Projects associated with that user are also deleted
  onDelete: 'CASCADE'
});

// further explains relationship between User and Project
Project.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Project };
