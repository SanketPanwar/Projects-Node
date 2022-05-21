const Sequelize=require('sequelize')

const sequelize= new Sequelize('expense-tracker','root','Sangit27',{
    dialect:'mysql',
    host:'localhost'
})



module.exports=sequelize;