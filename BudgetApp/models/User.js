const sequelize = require('../db')
const bcrypt = require('bcrypt');
const Board = require('./Board')
const { Model, DataTypes } = require('sequelize')

class User extends Model {

    static async findUser(email){
        try {
          const user = await User.findOne({
            where: {
              email: email
            }
          });
            console.log(user + " " + email);
            if(user.email === email){
                return user
            }else{
                return null
            }
        } catch (error) {
            return null
        }
    }

    static async validateUsername(username){
      try {
        const user = await User.findOne({
          where: {
            username: username
          }
        });
          console.log(user + " " + username);
          if(user){
              return true
          }else{
              return false
          }
      } catch (error) {
          return null
      }
    }

    static async getBoards(user)
    {
      const boards = await User.findByPk(user.userId);
      const list = boards.boardIDs;
      if (list !== null)
      {
        const realList = list.split(',');
        return realList;
      }
      return null;
    }

    static async Update(user, board)
    {
      const jane = await User.findByPk(user.userId);

      if (jane.boardIDs !== null)
      {
        jane.set({
          boardIDs: jane.boardIDs +"," + board.boardID
        });
      }
      else{
      jane.set({
        boardIDs: board.boardID
      });
    }
      await jane.save();
    }

    static async JoinBoard(user, board)
    {
      const jane = await User.findByPk(user.userId);
      const boardExists = await Board.findByPk(board);
      console.log(user.userId + " " + board)
      if (boardExists !== null){
        if (jane.boardIDs !== null)
        {
          if (!jane.boardIDs.includes(boardExists.boardID)){
            jane.set({
              boardIDs: jane.boardIDs +"," + board
            });
            boardExists.set({
              boardMembers: boardExists.boardMembers +"," + user.userId
            })
          }
        }
        else{
          jane.set({
            boardIDs: board
          });
          boardExists.set({
            boardMembers: boardExists.boardMembers +"," + user.userId
          })
          
        }
        await jane.save();
        await boardExists.save();
      }
      else {
        console.log("Error: Board Not Found");
      }
    }


    static async validateUser(email, password)
    {
      try {
        const user = await User.findOne({
          where: {
            email: email
          }
        });
        
        const validPass = await bcrypt.compare(password, user.password);
        if(user && validPass){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
    }
}

User.init({
  userId:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  boardIDs: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'User'
});

module.exports = User