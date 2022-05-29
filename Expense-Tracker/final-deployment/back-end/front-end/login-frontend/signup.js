
function notifyUser(message){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
        },2500)
}

document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('register')
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        const name=document.getElementById('name')
        const email=document.getElementById('email')
        const password=document.getElementById('password')
        const phone=document.getElementById('phone')
        const obj={ 
            name:name.value,
            email:email.value,
            password:password.value,
            phone:phone.value
        }
        name.value=''
        email.value=''
        password.value=''
        phone.value=''
        axios.post('http://65.1.111.110:3000/user/signup',obj)
        .then(res=>{
            alert(res.data.message)
            window.location.href='./login.html'
        })
        .catch(err=>{
            console.log(err.response.data.message)
        })
    })


})