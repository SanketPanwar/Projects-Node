const Product = require('../models/product');
const Cart=require('../models/cart')

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  // .then((products)=>{
  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'All Products',
  //     path: '/products'
  //   });
  // })
  // .catch(err=>{
  //   console.log(err)
  // })
  Product.findAll()
  .then(products=>{
    res.json(products)
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getProduct = (req,res,next)=>{
  const prodId=req.params.productId;
  Product.findByPk(prodId)
  .then((product)=>{
    res.render('shop/product-detail',{
      path:'/products',
      pageTitle:product.title,
      product:product
    })
  })
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getCart = (req, res, next) => {
  // req.user.getCart()
  // .then((cart)=>{
  //   return cart.getProducts();
  // })
  // .then((products)=>{
  //     res.render('shop/cart', {
  //     path: '/cart',
  //     pageTitle: 'Your Cart',
  //     products:products

  //   });
  // })
  // .catch(err=>{
  //   console.log(err)
  // })

  req.user.getCart()
  .then((cart)=>{
      return cart.getProducts()
  })
  .then((products)=>{
    res.status(200).json(products)
  })
  .catch(()=>{
    res.status(500).json({success:false,message:'can not extract from cart'})
  })

};

exports.postCart =(req, res, next) => {
  if(!req.body.productId)
  res.status(400).json({success:false, message: 'product Id is missing'})
  const prodId=req.body.productId;
  let fetchedCart;
  req.user.getCart()
  .then((cart)=>{
      fetchedCart=cart;
      return cart.getProducts({where:{id:prodId}})
  })
  .then((products)=>{
      let product;
      if(products.length>0){
        product=products[0]
      }
      let newQuantity=1;
      if(product){  
        const oldQuantity=product.cartItem.quantity;
        newQuantity=oldQuantity+1;
        return fetchedCart.addProduct(product,{through:{quantity: newQuantity}})
      }
      else{
        Product.findByPk(prodId)
        .then((product)=>{
          return fetchedCart.addProduct(product,{through:{quantity: newQuantity}})
        })
      }

  })
  .then(()=>{
    res.status(200).json({success:true,message:'Successfully added to the cart'})
  })
  .catch(err=>{
    res.status(500).json({success:false,message:'error occured while adding to the cart'})
  })

  //res.redirect('/cart');
}

exports.postDelete=(req,res,next)=>{
  if(!req.body.productId)
  return res.status(400).json({success:false,message:'Product Id missing'})
  const prodId=req.body.productId;
  req.user.getCart()
  .then((cart)=>{
    return cart.getProducts({where:{id:prodId}})
  })
  .then((products)=>{
    const product=products[0];
    product.cartItem.destroy();
    res.status(200).json({success:true, message: 'Successfully Deleted'})
    //res.redirect('/cart')
  })
  .catch(err=>{
    res.status(500).json({success:false,message:'error occured while deleting'})
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
