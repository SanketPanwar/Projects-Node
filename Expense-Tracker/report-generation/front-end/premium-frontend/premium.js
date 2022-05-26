
//enables dark theme by default
document.body.classList.toggle("dark")

//dark theme icon
const toggle = document.getElementById("toggle");

toggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark", e.target.unchecked);
});

const logout=document.getElementById('logout')
logout.addEventListener('click',()=>{
    window.location.href='../login-frontend/login.html'
    localStorage.removeItem('token')
})

function notifyUser(message){
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`;
    notificationContainer.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
        },2500)
}

const form=document.getElementById('expense')

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const amount=document.getElementById('amount')
    const description=document.getElementById('description')
    const category=document.getElementById('category')
    const obj={
        amount:amount.value,
        description:description.value,
        category:category.value
    }
    amount.value='';
    description.value='';
    category.value='';
    axios.post('http://localhost:5000/addExpense',obj,{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
    .then(res=>{
        notifyUser(res.data.message)
    })
    .catch(err=>{
        console.log(err)
    })

})


//display expense
const getExpense=document.getElementById('getExpense')
getExpense.addEventListener('click',()=>{
    displayExpenses('all')
})
const dailyBtn=document.getElementById('daily')
dailyBtn.addEventListener('click',()=>{
    displayExpenses('daily')
})
const weeklyBtn=document.getElementById('weekly')
weeklyBtn.addEventListener('click',()=>{
    displayExpenses('weekly')
})
const monthlyBtn=document.getElementById('monthly')
monthlyBtn.addEventListener('click',()=>{
    displayExpenses('monthly')
})

//displaying expense
function displayExpenses(limit){
    const displayContainer=document.getElementById('displayContainer')
    displayContainer.innerHTML=''
    axios.get(`http://localhost:5000/getExpenses?limit=${limit}`,{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
    .then(response=>{
        console.log(response.data.expenses)
        const table=document.createElement('table')
        table.setAttribute('class','styled-table')
        const thead=document.createElement('thead')
        const tbody=document.createElement('tbody')
        const tfoot=document.createElement('tfoot')
        let total=0;
        thead.innerHTML=`
            <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th></th>
            </tr>
        `
        response.data.expenses.forEach(expense=>{
            const row=document.createElement('tr')
            row.setAttribute('id',`e${expense.id}`)
            row.innerHTML=`
                <td>${expense.createdAt.substring(0,10)}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td><button id="dltbtn" style="color:red;border-radius:5px;padding:3px;">Delete</button></td>
            `
            total+=parseInt(`${expense.amount}`)
            tbody.appendChild(row);
        })
        tfoot.innerHTML=`
                <tr>
                <td>Total</td>
                <td>${total}</td>
                <td></td>
                <td></td>
                <td></td>
                </tr>
            `
        table.appendChild(thead)
        table.appendChild(tbody)
        table.appendChild(tfoot)
        displayContainer.appendChild(table)

    })
    .catch(err=>{
        console.log(err)
    })
}


//delete expense
const displayContainer=document.getElementById('displayContainer')
displayContainer.addEventListener('click',(e)=>{
    if(e.target.id=='dltbtn'){
        const trId=e.target.parentNode.parentNode.id.substring(1);
        const tr=e.target.parentNode.parentNode
        axios.post(`http://localhost:5000/deleteExpense/${trId}`,{},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
        .then((res)=>{
            tr.remove()
            notifyUser(res.data.message)
        })
        .catch(err=>{console.log(err)})
    }
})

//download Expense
const downloadBtn=document.getElementById('download')
downloadBtn.addEventListener('click',()=>{
    axios.get('http://localhost:5000/download',{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
    .then(response=>{
        const link=document.createElement('a');
        link.href=`${response.data.fileUrl}`;
        link.download='MyExpenses.csv'
        link.click();
    })
    .catch((err)=>{
        console.log(err)
        document.innerHTML+=`<div>${err}</div>`
    })
})

document.addEventListener('DOMContentLoaded',()=>{
    const previousDownloadDiv=document.getElementById('previousDownload')
    axios.get('http://localhost:5000/previousdownloads',{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
    .then(response=>{
        previousDownloadDiv.innerHTML='';
        let heading=document.createElement('h2');
        heading.innerHTML='Previous Downloads'
        previousDownloadDiv.appendChild(heading)
        const ul=document.createElement('ul')
        response.data.links.reverse().forEach(link=>{
            const li=document.createElement('li')
            li.innerHTML=`<a href="${link.link}">${link.fileName}</a>`
            ul.appendChild(li)
        })
        previousDownloadDiv.appendChild(ul)
    })
    .catch(err=>{
        console.log(err)
    })
})




