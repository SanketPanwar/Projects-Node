

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
        //li.remove()
        axios.post(`http://localhost:5000/deleteExpense/${liId}`,{},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
        .then((res)=>{
            li.remove()
            notifyUser(res.data.message)
        })
        .catch(err=>{console.log(err)})
    }
})

//premium
const premiumBtn = document.getElementById("premium");
const payBtn=document.getElementById('pay')
const close = document.getElementById("close");
const container = document.getElementById("popup-container");
const amount=49900
let orderId;



premiumBtn.addEventListener("click", () => {
    container.classList.add("active");
    axios.post('http://localhost:5000/premium/create/order',{amount:amount},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})    
    .then(response=>{
        orderId=response.data.order.id;
        payBtn.style="display:block"
    })
    .catch(err=>{
        console.log(err)
    })
});

close.addEventListener("click", () => {
    container.classList.remove("active");
    payBtn.style="display:none"
});


let paymentId;
let signature;
payBtn.addEventListener('click',(e)=>{
    container.classList.remove("active");
    payBtn.style="display:none"
    var options = {
        "key": "rzp_test_OkIX8ZpSO69T6R", // Enter the Key ID generated from the Dashboard
        "amount": `${amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Expense Tracker",
        "description": "Premium",
        //"image": "https://example.com/your_logo",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            paymentId=response.razorpay_payment_id;
            signature=response.razorpay_signature;
            alert(`Payment successful: your order ID: ${response.razorpay_order_id} and payment ID:${response.razorpay_payment_id}`);
            window.location.href="./premium-frontend/premium.html"
            
            axios.post('http://localhost:5000/transaction/detail',{orderId:orderId,paymentId:paymentId},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
            .then()
            .catch(err=>{
                console.log(err)
            })
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.description);
    });
    rzp1.open();
    e.preventDefault();

})

//dark theme icon
const toggle = document.getElementById("toggle");

toggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark", e.target.checked);
});


