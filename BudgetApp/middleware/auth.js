const User = require("../models/User");

async function authUser(req, res, next) {
  const boards = await User.getBoards(req.session.user);
  if (boards.includes(req.query.boardId))
  {
    next();
  }
  else {
    return res.send("Not allowed");
  }
}

module.exports = {
  authUser
}