const Expense=require('../models/expense')

exports.addExpense=(req, res, next)=>{
    const {amount,description,category}=req.body;
    req.user.createExpense({amount,description,category})
    .then(()=>{
        res.status(201).json({success:true,message:'expense added successfully'})
    })
    .catch(err=>{
        console.log(err)
        res.status(403).json({success:false,message:'expense not added'})

    })
}

exports.getExpense=(req,res,next)=>{
    req.user.getExpenses()
    .then(expenses=>{
        res.status(200).json({success:true,expenses:expenses})
    })
    .catch(err=>{
        console.log(err)
        res.json(err)
    })
}

exports.deleteExpense=(req,res,next)=>{
    const id=req.params.expenseId;
    req.user.getExpenses({where:{id:id}})
    .then((expenses)=>{
        const expense=expenses[0]
        expense.destroy()
        res.status(201).json({message:'Deleted successfully'})
    })
    .catch(err=>{
        console.log(err)
    })
}

