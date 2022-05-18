// const cart_items = document.querySelector('#cart .cart-items');


// const parentContainer = document.getElementById('EcommerceContainer');
// parentContainer.addEventListener('click',(e)=>{

//     if (e.target.className=='shop-item-button'){
//         const id = e.target.parentNode.parentNode.id
//         const name = document.querySelector(`#${id} h3`).innerText;
//         const img_src = document.querySelector(`#${id} img`).src;
//         const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
//         let total_cart_price = document.querySelector('#total-value').innerText;
//         if (document.querySelector(`#in-cart-${id}`)){
//             alert('This item is already added to the cart');
//             return
//         }
//         document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1
//         const cart_item = document.createElement('div');
//         cart_item.classList.add('cart-row');
//         cart_item.setAttribute('id',`in-cart-${id}`);
//         total_cart_price = parseFloat(total_cart_price) + parseFloat(price)
//         total_cart_price = total_cart_price.toFixed(2)
//         document.querySelector('#total-value').innerText = `${total_cart_price}`;
//         cart_item.innerHTML = `
//         <span class='cart-item cart-column'>
//         <img class='cart-img' src="${img_src}" alt="">
//             <span>${name}</span>
//     </span>
//     <span class='cart-price cart-column'>${price}</span>
//     <span class='cart-quantity cart-column'>
//         <input type="text" value="1">
//         <button>REMOVE</button>
//     </span>`
//         cart_items.appendChild(cart_item)

//         const container = document.getElementById('container');
//         const notification = document.createElement('div');
//         notification.classList.add('notification');
//         notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
//         container.appendChild(notification);
//         setTimeout(()=>{
//             notification.remove();
//         },2500)
//     }
//     if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
//         document.querySelector('#cart').style = "display:block;"
//     }
//     if (e.target.className=='cancel'){
//         document.querySelector('#cart').style = "display:none;"
//     }
//     if (e.target.className=='purchase-btn'){
//         if (parseInt(document.querySelector('.cart-number').innerText) === 0){
//             alert('You have Nothing in Cart , Add some products to purchase !');
//             return
//         }
//         alert('Thanks for the purchase')
//         cart_items.innerHTML = ""
//         document.querySelector('.cart-number').innerText = 0
//         document.querySelector('#total-value').innerText = `0`;
//     }

//     if (e.target.innerText=='REMOVE'){
//         let total_cart_price = document.querySelector('#total-value').innerText;
//         total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;
//         document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1
//         document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
//         e.target.parentNode.parentNode.remove()
//     }
// })


document.addEventListener('DOMContentLoaded',()=>{

    //display products
    axios.get('http://localhost:4000/products')
    .then(result=>{
        const productsDisplayContainerDiv=document.getElementById('products-content')
        result.data.forEach(product=>{
            const eachProduct=document.createElement('div');
            eachProduct.setAttribute('id',`p${product.id}`)
            eachProduct.innerHTML=`<h3>${product.title}</h3> 
            <div> <img src="${product.imageUrl}" </div>  
            <div> <p>${product.description}</p></div> 
            <div> 
                <span>$</span> 
                <span>${product.price} </span> 
                <span> <button class="shop-item-button"> Add to Cart </button> </span> 
            </div> 
            <br>`
            productsDisplayContainerDiv.appendChild(eachProduct)
        })

    })
    .catch(err=>{
        console.log(err)
    })

    const parentContainer = document.getElementById('EcommerceContainer');
    parentContainer.addEventListener('click',(event)=>{

    //adding to cart database
    const productsDisplayContainerDiv=document.getElementById('products-content');
        if(event.target.classList.contains("shop-item-button")){
            const parentId=event.target.parentNode.parentNode.parentNode.parentNode.id;
            axios.post('http://localhost:4000/cart',{'productId':parentId.substring(1)})
            .then((response)=>{
                if(response.status===200)
                    notifyUser(response.data.message)
                else
                    throw new Error(response.data.message)
            })
            .catch(err=>{
                console.log(err)
                notifyUser(err)
            })


        }


    //displaying in cart
    if (event.target.className=='cart-btn-bottom' || event.target.className=='cart-bottom' || event.target.className=='cart-holder'){
        axios.get('http://localhost:4000/cart')
        .then(response=>{
            displayInCart(response)
            document.querySelector('#cart').style = "display:block;"
        })
        .catch(err=>{
            console.log(err)
        })
    }
    if (event.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
        const cart_items = document.querySelector('#cart .cart-items');
        cart_items.innerHTML='';
    }
    

    //removing from cart
    if (event.target.innerText=='REMOVE'){
        axios.post('http://localhost:4000/cart-delete-item',{'productId':event.target.parentNode.parentNode.id.substring(8)})
        .then(response=>{
        removeFromFrontendCart(event)
        notifyUser(response.data.message)    
        })
        .catch(errmsg=>{
        console.log(errmsg)
        })

    }


}) //ecommerce container end
})  //domContentLoaded end

function displayInCart(response){
        const cart_items = document.querySelector('#cart .cart-items');
        let totalAmount=0;
        let totalproducts=0;
        response.data.forEach((prod)=>{
        const cart_item = document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id',`in-cart-${prod.id}`)
        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${prod.imageUrl}" alt="">
            <span>${prod.title}</span>
        </span>
        <span class='cart-price cart-column'>${prod.price}</span>
        <span class='cart-quantity cart-column'>
        <input type="text" value="${prod.cartItem.quantity}">
        <button>REMOVE</button>
        </span>`
        cart_items.appendChild(cart_item)
        totalAmount+=(parseFloat(prod.price)*parseFloat(prod.cartItem.quantity))
        totalproducts++;
        })
        document.querySelector('#total-value').innerText=totalAmount.toFixed(2);
        document.querySelector('.cart-number').innerText=totalproducts;


}

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

function removeFromFrontendCart(event){
    let total_cart_price = document.querySelector('#total-value').innerText;
    let item_price=document.querySelector(`#${event.target.parentNode.parentNode.id} .cart-price`).innerText;
    let item_quantity=event.target.parentNode.firstElementChild.value;

    total_cart_price = parseFloat(total_cart_price).toFixed(2) - (parseFloat(item_price).toFixed(2) * parseInt(item_quantity)) ;
    document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1
    document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
    event.target.parentNode.parentNode.remove()
}


