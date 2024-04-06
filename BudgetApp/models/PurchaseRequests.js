const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class PurchaseRequests extends Model {
    static async getItems(){
        const items = await PurchaseRequests.findAll();
        return items;
    }
}

PurchaseRequests.init({
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  PartID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PartName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  PartVendor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PartPrice: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PartAmountRequested: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0
  },
  OrderedStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  EstimatedArrival: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize, 
  modelName: 'PurchaseRequests'
});

module.exports = PurchaseRequests