const sequelize = require('../db')
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

    static async validateUser(email, password)
    {
      try {
        const user = await User.findOne({
          where: {
            email: email
          }
        });
        
        
        if(user && user.password === password){
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