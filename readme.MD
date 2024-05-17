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