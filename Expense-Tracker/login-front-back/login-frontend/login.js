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
        alert(res.data.message)
    })
    .catch(err=>{
        console.log(err)
        alert(err.response.data.message)
    })
})