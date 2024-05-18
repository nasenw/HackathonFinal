const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Board extends Model {

    static async findBoard(board){
        
        const boards = await Board.findByPk(board);
        return boards;
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
  }
}, {
  sequelize, 
  modelName: 'Board'
});

module.exports = Board