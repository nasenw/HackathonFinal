var express = require('express');
const User = require('../models/User');
const Board = require('../models/Board');
var router = express.Router();

const sessionChecker = (req, res, next)=>{
  if (req.session.user){
    next()
  }
  else {
    res.redirect('/?msg=raf')
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.get('/index', (req, res, next) => {
  res.render('index')
})


router.post('/user-signedup', async function(req, res, next) {

  const existing = await User.findUser(req.body.email);
  console.log(existing + "Yooo");
  if (existing == null)
  {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
  })
  }
  else {
    console.log("User already in database");
  }
  
  // const user = await User.findUser(req.body.username, req.body.password)
  // if(user!== null){
  //   req.session.user = user
  //   res.redirect("/courses")
  // }else{
  //   res.redirect("/?msg=fail")
  // }
  
  res.redirect('index');
})



router.post('/user-signin', async function(req, res, next) {

  if (req.body.email !== undefined && req.body.password !== undefined)
  {
    const user = await User.validateUser(req.body.email, req.body.password);
    if (user)
    {
      const user = await User.findUser(req.body.email)
      req.session.user = user;
      res.redirect('landing');
    }
  
  }
  
  // const user = await User.findUser(req.body.username, req.body.password)
  // if(user!== null){
  //   req.session.user = user
  //   res.redirect("/courses")
  // }else{
  //   res.redirect("/?msg=fail")
  // }
  
  res.render('index');
})

router.use(sessionChecker);

router.post('/addBoard', async function(req, res, next) {
  const board = await Board.create({
    boardName: req.body.boardName,
    boardBudget: req.body.boardBudget,
    boardDescription: req.body.boardDescription,
    boardEmail: req.body.boardEmail,
    boardPhoto: req.body.boardPhoto,
    boardPhone: req.body.boardPhone
})

const user = req.session.user; 

await User.Update(user, board)


console.log(board);


console.log(req.session.user);

res.redirect('/landing');
});

  

router.get('/landing', async (req, res, next) => {


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
    
    res.render('landing', { boards: boardsArray });
})

router.get('/olyPage', async (req, res, next) => {
  const boardId = req.query.boardId;

  await Board.findBoard(boardId)
    .then(board => {
      if (board) {
        res.render('olypage', { board: board });
      } 
    })
})

router.get('/homepage',async (req, res, next) => {
  const boardId = req.query.boardId;

  // Use the boardId to fetch the corresponding data
  // Example: Fetch data for the specified boardId
  await Board.findBoard(boardId)
    .then(board => {
      if (board) {
        // Render the homepage with the fetched data
        res.render('homepage', { board: board });
      } else {
        // Handle the case where the board with the specified ID was not found
        res.status(404).send('Board not found');
      }
    })
    .catch(err => {
      // Handle errors that occur during data fetching
      console.error('Error fetching board:', err);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;
