
# Notes Search App

Tech stack: -
    Nodejs + Express.js for Backend
    and MongoDb for Database
    and Mocha and Chai for Testing.

## setup

Before run the App use npm i cmd on terminal to install all the dependencies. 
Run 'npm start' command  to start the app and 'npm test' to test the app.
Use Bearer Token for authorization.

#  Api References

## Users Apis 

### 1 - Signup(/api/auth/signup) -> POST request

    req body :-

    {
        "firstName" : "firstName",
        "lastName" : "lastName",
        "username" : "username",
        "email": "example@gmail.com",
        "password" : "password"
    }

username and email must be unique and lastname is optional

### 2 - login (/api/auth/login) -> POST request

    req body :- 

    {
        "username" : "example4@gmail.com",
        "password" : "password"
    }

in username field you can use email or username to login

### 3 - logout (/api/auth/logout) -> GET Request

Note -> you need to set the accessToken before logout which you will get it after login.

## Notes Apis

### 1 - Get All Notes(/api/notes/) -> GET Request

### 2 - Get Note By Id (/api/notes/:id) -> Get request
    replace ':id' with Note Object Id which you want

### 3 - Create new Note(/api/notes/) -> POST request
    req body :-

    {
        "title" : "title",
        "content" : "content"
    }

### 4 - Update Note (/api/notes/:id) -> PUT request

    req body : -

    {
        "title" : "newtitle",
        "content" : "newcontent"
    }

### 5 - Delete Note (/api/notes/:id) -> DELETE Request

### 6 - Share Note (/api/notes/:id/share) -> POST Request

    req body : -

    {
        "shareUser" : "6596cc49fea6772737cb1ff7"
    }

    you need to pass user object id here

### 7 - Search Note (/api/notes/search?q=query) -> GET Request
    replace query with search keyword


Note - all the operation works only if you are authorized and all the operation works if the notes owner is login user.