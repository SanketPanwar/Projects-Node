

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
    axios.post('http://65.1.111.110:3000/user/login',obj)
    .then(res=>{
        localStorage.setItem('token',`${res.data.token}`)
        localStorage.setItem('rows',5)
        if(res.data.isPremium)
        window.location.href='../premium-frontend/premium.html';
        else
        window.location.href='../non-premium-frontend/index.html';
    })
    .catch(err=>{
        console.log(err)
        alert(err.response.data.message)
    })
})

//anchor link
const forgotPassword=document.getElementById('forgotPassword')
forgotPassword.addEventListener('click',()=>{
    document.body.innerHTML=`
        <div id="FPdiv" style="display:flex; flex-direction:column; margin-top:10rem; align-items:center; justify-content:center;">
            <h3>Enter Your Email</h3>
            <form id=FPform>
            <label for="email">Email Address:</label>
            <input type="email"  id="FPemail" name="email" required>
            <br><br>
            <button type="submit" style="cursor:pointer;">Submit</button>
            </form>
        </div>
    `
    const FPform=document.getElementById('FPform')
    FPform.addEventListener('submit',(e)=>{
        e.preventDefault()
        const emailInput=document.getElementById('FPemail')
        const email=emailInput.value
        emailInput.value=''
        ////for sendgrid
        // const div=document.createElement('div')
        // div.innerHTML=`
        //   <p>Password Reset link sent to your Email</p> 
        //   <a href="">Login Now </a>
        // `
        // document.getElementById('FPdiv').appendChild(div)
        axios.post('http://65.1.111.110:3000/forgot/password',{email:email})
        .then(response=>{
            if(!response.data.success){
            alert(response.data.message)
            window.location.href="./signup.html"
            }
            else{
                alert(response.data.message)
                window.location.href=""
            }

        })
        .catch(err=>{
            console.log(err)
        })
    })
})
