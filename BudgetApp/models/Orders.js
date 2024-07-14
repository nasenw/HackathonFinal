const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Orders extends Model {
    static async getItems(){
        const items = await PRItems.findAll();
        return items;
    }
}

Orders.init({
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ClubID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ItemIDs: {
    type: DataTypes.STRING,
    allowNull: false
  },
  OrderPrice: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  OrderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  OrderApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}, {
  sequelize, 
  modelName: 'Orders'
});

module.exports = Orders