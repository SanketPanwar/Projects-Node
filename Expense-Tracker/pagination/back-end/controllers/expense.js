const Expense=require('../models/expense')
const query=require('express/lib/middleware/query')
const UserServices=require('../services/userServices')
const S3Services=require('../services/s3Services')
const Sequelize=require('sequelize')
const Op=Sequelize.Op

exports.downloadExpense=async (req,res,next)=>{
    try {
        const expenses=await UserServices.getExpenses(req);
        const userId=req.user.id
        const stringified=JSON.stringify(expenses)
        const fileName=`expenses${userId}/${new Date()}`
        const downloadLink=await S3Services.uploadToS3(fileName,stringified)
        await req.user.createDownload({fileName:`${new Date()}`,link:`${downloadLink}`})
        res.status(200).json({success:true,fileUrl:downloadLink})
    } catch (error) {
        res.status(500).json({success:false,error})
    }
}

exports.previousDownload=(req,res,next)=>{
    req.user.getDownloads()
    .then(downloads=>{
        res.status(200).json({success:true,links:downloads})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({success:false,error:err})
    })
}

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
    const limit=req.query.limit;
    const page= +req.query.page||1;
    const rows= +req.query.rows||10;
    console.log(page,rows)
    let totalExpenses;
    let today=new Date();
    let date=new Date('1980-01-01');
    if(limit=='weekly'){
        const todayDateOnly=new Date(today.toDateString())
        date=new Date(todayDateOnly.setDate(todayDateOnly.getDate()-6))
    }
    else if(limit=='daily'){
        date=new Date(today.toDateString())
    }
    else if(limit=='monthly'){
        date=new Date(today.getFullYear(),today.getMonth(),1)
    }

    req.user.countExpenses({where:{
        createdAt : { [Op.and]:[{ [Op.gte] : date },{ [Op.lte] : today }]}
    }
    })
    .then(count=>{
        totalExpenses=count;
        req.user.getExpenses({where:{
            createdAt : { [Op.and]:[{ [Op.gte] : date },{ [Op.lte] : today }]}
        },
        order : [['createdAt','DESC']],
        offset:(page-1)*rows,
        limit:rows
        })
        .then(expenses=>{
            // const filteredExpenses=expenses.filter((expense)=>{
            //     return expense.createdAt>=date;
            // })
            return res.status(200).json({success:true,expenses:expenses,currentPage:page,hasPreviousPage:page>1,hasNextPage:(page*rows)<totalExpenses,previousPage:page-1,nextPage:page+1,lastPage:Math.ceil(totalExpenses/rows)})
        })
        .catch(err=>{
            throw new Error(err)
        })

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

