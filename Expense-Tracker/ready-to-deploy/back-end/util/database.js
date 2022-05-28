const Sequelize=require('sequelize')

const sequelize= new Sequelize(process.env.DB_SCHEMA,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    dialect:'mysql',
    host:process.env.DB_HOST
})
// const sequelize= new Sequelize(`expense-tracker`,`root`,`Sangit27`,{
//     dialect:'mysql',
//     host:`localhost`
// })



module.exports=sequelize;