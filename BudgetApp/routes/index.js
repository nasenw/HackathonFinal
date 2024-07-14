var express = require("express");
const User = require("../models/User");
const Board = require("../models/Board");
const PRItems = require("../models/PRItems");
const Orders = require("../models/Orders");
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
  const validateUser = await User.validateUsername(req.body.username); // Validate by username instead of email, right now im just making sure its unique
  console.log(existing + "Yooo");
  if (existing == null && validateUser === false) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
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
    boardAdmins: req.session.user.userId,
    boardMembers: req.session.user.userId
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

router.post("/joinBoard", async (req, res, next) => { // Make this a fetch later so just the club page refreshes
  const joined = await User.JoinBoard(req.session.user, req.body.boardName);
  
  res.redirect('/landing');
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

router.post("/clubPurchaseRequest", async (req, res, next) => {
  const boardId = req.body.boardID;

  // Add items -- Ill fix this mess later surely
  let retailers = req.body['retailer[]'];
  let itemNames = req.body['itemName[]'];
  let partNumbers = req.body['partNumber[]'];
  let prices = req.body['price[]'];
  let quantitys = req.body['quantity[]'];
  let links = req.body['link[]'];
  let partNotes = req.body['notes[]'];

  let itemList = []
  console.log(retailers);
  
  for (let i = 0; i < retailers.length; i++)
  {
    var newPart = await PRItems.create({
      PartRetailer: retailers[i],
      PartName: itemNames[i],
      PartNumber: partNumbers[i],
      PartPrice: prices[i],
      PartAmountRequested: quantitys[i],
      PartLink: links[i],
      PartNotes: partNotes[i]
    });
    console.log(newPart.ID);
    itemList.push(newPart.ID);
  }

  let fixedItemList = itemList.join(', ');
  // Add order
  await Orders.create({
    ClubID: boardId,
    ItemIDs: fixedItemList,
    ClubID: boardId
  })
  res.redirect('/purchaseRequest?boardId=' + boardId + "&success=true");
}); 


router.get("/purchaseRequest", authUser, async (req, res, next) => {
  const boardId = req.query.boardId;
  const success = req.query.success;


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
    const users = await Board.getUsers(board);
    let userList = []; 
    if (users && Array.isArray(users)) {
      for (const clubMember of users) {
        let adminStatus = await Board.isAdmin(boardId, clubMember)
        if (adminStatus !== true)
        {
          const user = await User.findByPk(clubMember);
          userList.push(user); 
        }
      }
    }
    const isAdmin = await Board.isAdmin(boardId, req.session.user.userId);
    console.log("FINAL: IS AN ADMIN == " + isAdmin)
    res.render("homepage", { board: board, isAdmin: isAdmin, users: userList });
  }
});

router.post("/setAdmin", async (req, res, next) => {
  const boardId = req.body.boardID
  console.log(boardId)
  const member = req.body.member;
  await Board.AddAdmin(boardId, member);

  res.redirect("/landing");
});

module.exports = router;
