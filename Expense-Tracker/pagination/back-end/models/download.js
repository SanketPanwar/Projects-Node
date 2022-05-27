const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const Download=sequelize.define('download',{
    fileName:Sequelize.STRING,
    link:Sequelize.STRING
})

module.exports=Download;