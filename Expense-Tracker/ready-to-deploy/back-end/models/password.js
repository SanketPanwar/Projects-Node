const Sequelize=require('sequelize')

const sequelize=require('../util/database')

const Password=sequelize.define('password',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    uuid:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
})

module.exports=Password;