const Sequelize=require('sequelize')

const sequelize=new Sequelize('node-complete','root','Sangit27',{
    dialect: 'mysql',
    host:'localhost'
})

module.exports=sequelize;