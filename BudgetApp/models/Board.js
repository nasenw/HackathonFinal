const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Board extends Model {

    static async findBoard(board){
        
        const boards = await Board.findByPk(board);
        return boards;
    }

    static async getUsers(board)
    {
      const list = board.boardMembers;
      console.log(list + "LIST")
      console.log(board + "BOARD")
      if (list !== null)
      {
        const realList = list.split(',');
        return realList;
      }
    }

    

    static async isAdmin(boardID, user)
    {
      const boards = await Board.findByPk(boardID);
      const list = boards.boardAdmins;
      console.log(list);
      if (list !== null)
      {
        const realList = list.split(',');
        console.log(realList + "-----" + user)
        if (realList.includes(user) || realList == user)
        {
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