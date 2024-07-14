const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class PRItems extends Model {
    static async getItems(){
        const items = await PRItems.findAll();
        return items;
    }
}

PRItems.init({
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  PartName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PartNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  PartRetailer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PartPrice: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  PartAmountRequested: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  PartLink: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PartNotes: {
    type: DataTypes.STRING,
    allowNull: false
  },
  OrderedStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: false
  },
  EstimatedArrival: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'PRItems'
});

module.exports = PRItems