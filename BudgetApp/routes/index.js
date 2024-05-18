var express = require("express");
const User = require("../models/User");
const Board = require("../models/Board");
const bcrypt = require("bcrypt");
const { authUser } = require("../middleware/auth")

var router = express.Router();

const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/?msg=raf");
  }
};

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/signout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.render("index");
});

router.get("/index", (req, res, next) => {
  res.render("index");
});

router.post("/user-signedup", async function (req, res, next) {
  const existing = await User.findUser(req.body.email);
  console.log(existing + "Yooo");
  if (existing == null) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
  } else {
    console.log("User already in database");
  }
  res.redirect("index");
});

router.post("/user-signin", async function (req, res, next) {
  if (req.body.email !== undefined && req.body.password !== undefined) {
    const user = await User.validateUser(req.body.email, req.body.password);
    if (user) {
      const user = await User.findUser(req.body.email);
      req.session.user = user;
      res.redirect("landing");
    }
  }

  res.render("index");
});

router.use(sessionChecker);

router.post("/addBoard", async function (req, res, next) {
  const board = await Board.create({
    boardName: req.body.boardName,
    boardBudget: req.body.boardBudget,
    boardDescription: req.body.boardDescription,
    boardEmail: req.body.boardEmail,
    boardPhoto: req.body.boardPhoto,
    boardPhone: req.body.boardPhone,
  });

  const user = req.session.user;

  await User.Update(user, board);

  console.log(board);

  console.log(req.session.user);

  res.redirect("/landing");
});

router.get("/landing", async (req, res, next) => {
  const boards = await User.getBoards(req.session.user);
  console.log(boards + "--------------");

  let boardsArray = []; // Default value

  if (boards && Array.isArray(boards)) {
    console.log("dasadsfASDfsadfASDsf");
    // boardsArray = boards;

    for (const boardId of boards) {
      const board = await Board.findBoard(boardId);
      boardsArray.push(board); // Add the board object to the boardsArray
    }
  }

  res.render("landing", { boards: boardsArray });
});

// ----------------------------------------------------------------- Add Authentication For Below Pages ------------------------------------------------- //

router.get("/graphPage", authUser, async (req, res, next) => {
  const boardId = req.query.boardId;

  await Board.findBoard(boardId).then((board) => {
    if (board) {
      res.render("graph", { board: board });
    }
  });
});

router.get("/purchaseRequest", authUser, async (req, res, next) => {
  const boardId = req.query.boardId;

  const board = await Board.findBoard(boardId);
  if (board) {
    res.render("inventory", { board: board });
  }
});

router.get("/olyPage", authUser, async (req, res, next) => {
  const boardId = req.query.boardId;

  await Board.findBoard(boardId).then((board) => {
    if (board) {
      res.render("olypage", { board: board });
    }
  });
});

router.get("/homepage", authUser, async (req, res, next) => {
  const boardId = req.query.boardId;

  const board = await Board.findBoard(boardId);
  if (board) {
    res.render("homepage", { board: board });
  }
});

module.exports = router;
