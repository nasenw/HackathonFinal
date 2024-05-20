const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')
const User = require('./User')

class Board extends Model {

    static async findBoard(board){
        
        const boards = await Board.findByPk(board);
        return boards;
    }

    static async getUsers(board)
    {
      const list = board.boardMembers;

      if (list !== null)
      {
        const realList = list.split(',');
        return realList;
      }
    }

    static async getAdmins(board)
    {
      console.log("BOARD: " + board)
      console.log("BOARD ADMINS: " + board.boardAdmins)
      const list = board.boardAdmins;
      if (list !== null)
      {
        const realList = list.split(',');
        return realList;
      }
    }

    static async AddAdmin(boardId, userId)
    {
      const board = await Board.findByPk(boardId);
      console.log("BOARDID ADDADMIN: " + boardId)
      console.log("BOARD ADDADMIN: " + board)
      const boardAdminList = await Board.getAdmins(board);
      console.log("user.userID: " + userId)
      if (!boardAdminList.includes(userId))
      {
        if (board.boardAdmins === null)
        {
          board.set({
            boardAdmins: userId
          })
        }
        else { 
          board.set({
            boardAdmins: board.boardAdmins +"," + userId
          })
        }
        await board.save();
      }

    }

    

    static async isAdmin(boardID, user)
    {
      const boards = await Board.findByPk(boardID);
      const list = boards.boardAdmins;
      console.log(list);
      if (list !== null)
      { 
        console.log("Checking if Admin")
        const realList = list.split(',');
        console.log(realList + "-----" + user)
        if (realList.includes(String(user)))
        {
          console.log("IS AN ADMIN!")
          return true
        }
      }
      return false;
    }
}

Board.init({
  boardID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  boardName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  boardEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boardPhoto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  boardPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  boardBudget: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  boardDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  inventoryIDs: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boardAdmins: {
    type: DataTypes.STRING,
    allowNull: false
  },
  boardMembers: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, 
  modelName: 'Board'
});

module.exports = Board