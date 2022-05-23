const form=document.getElementById('login')

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email=document.getElementById('email')
    const password=document.getElementById('password')
    const obj={ 
        email:email.value,
        password:password.value
    }

    email.value=''
    password.value=''
    axios.post('http://localhost:5000/user/login',obj)
    .then(res=>{
        localStorage.setItem('token',`${res.data.token}`)
        if(res.data.isPremium)
        window.location.href='../premium-frontend/premium.html';
        else
        window.location.href='../index.html';
    })
    .catch(err=>{
        console.log(err)
        alert(err.response.data.message)
    })
})