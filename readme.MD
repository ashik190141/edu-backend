## Registration
 - operation = post
 - url = http://localhost:5000/api/v1/auth/register
 - body = {
            "name":"Ahsan Mahmud Ashik",
            "email":"school@gmail.com",
            "password":"123456",
            "role":"School"
        }

## Login
 - operation = post
 - url = http://localhost:5000/api/v1/auth/login
 - body = {
            "email":"school@gmail.com",
            "password":"123456"
        }

## Create Product
 - operation: post
 - url = http://localhost:5000/api/v1/product/create-product
 - body = {
            "name":"A4",
            "image":"https://m.media-amazon.com/images/I/61OorFhm6SL._AC_UF894,1000_QL80_.jpg",
            "price":200,
            "category":"Paper",
            "description":"It is very good for writing"
        }

## All Product
 - operation: get
 - url : http://localhost:5000/api/v1/product/all-product/{loggedInUserEmail}

## Add add to cart
 - operation: post
 - url: http://localhost:5000/api/v1/cart/addToCart
 - body: {
            "email":"school@gmail.com",
            "productId":"66475ae2beda000e80639732"
        }

## Get All Cart Data
 - operation: get
 - url: http://localhost:5000/api/v1/cart/addToCart/{loggedInUserInfo}