const dotenv=require('dotenv')
dotenv.config()
const express=require('express')

const path=require('path')
const bodyParser=require('body-parser')

const sequelize=require('./util/database')

const User=require('./models/user')
const Expense=require('./models/expense')
const Order=require('./models/order')
const Password=require('./models/password')
const Download=require('./models/download')

const cors=require('cors')

const authRoutes=require('./routes/auth')
const expenseRoutes=require('./routes/expense')
const premiumRoutes=require('./routes/premium')
const forgotPasswordRoutes=require('./routes/forgotPassword')



const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(cors());

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasOne(Order)
Order.belongsTo(User)
User.hasMany(Password)
Password.belongsTo(User)
User.hasMany(Download)
Download.belongsTo(User)

app.use('/user',authRoutes);
app.use(expenseRoutes)
app.use(premiumRoutes)
app.use(forgotPasswordRoutes)

sequelize.sync()
.then(()=>{
    app.listen(5000)
})
.catch(err=>{
    console.log(err)
})



