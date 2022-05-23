//enables dark theme by default
document.body.classList.toggle("dark")

//dark theme icon
const toggle = document.getElementById("toggle");

toggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark", e.target.unchecked);
});

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
    const displayContainer=document.getElementById('displayContainer')
    displayContainer.innerHTML=''
    axios.get('http://localhost:5000/getExpenses',{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
    .then(response=>{
        const ul=document.createElement('ul')
        response.data.expenses.forEach(expense=>{
            const li=document.createElement('li')
            li.setAttribute('id',`e${expense.id}`)
            li.innerHTML=`
                <span> ${expense.amount} :  </span>
                <span> ${expense.category} :  </span>
                <span> ${expense.description}   </span>
                <span> <button id="dltbtn" style="color:red;border-radius:5px;">Delete</button> </span>
            `
            ul.appendChild(li)

        })
        displayContainer.appendChild(ul)
    })
    .catch(err=>{
        console.log(err)
    })
})


//delete expense
const displayContainer=document.getElementById('displayContainer')
displayContainer.addEventListener('click',(e)=>{
    if(e.target.id=='dltbtn'){
        const liId=e.target.parentNode.parentNode.id.substring(1);
        const li=e.target.parentNode.parentNode
        axios.post(`http://localhost:5000/deleteExpense/${liId}`,{},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
        .then((res)=>{
            li.remove()
            notifyUser(res.data.message)
        })
        .catch(err=>{console.log(err)})
    }
})






