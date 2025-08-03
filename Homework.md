- HomeWork : 

- API Get user by email 
- Build Feed API - Get all the users from the database 



- API Get User By Id 

- API Delete user By Id

- API : Update the data of the user 

- Explore the Mongoose Documentation for Model Methods 

- What are options in a Model.findOneAndUpdate method, explore more about it 

- API  - Update the user with email ID

- Explore SchemaType Options from the documentation  : 

    - add , required , unique , lowercase , min, minLength, trim      
    - Add default value 
    - Create a custom validate function for gender 

- Improve DB schema - Put all the appropiate  validation on each field in Schema 
- Add timestamps to the userschema 

Data Sanitization : 

- Add API Level Validation on Patch request & Signup Post API 
- Add API validation for each field 
- 'Never Trust Req Body' 🙃🙃




Encrypting Passwords

- Create a Helper function (Folder Utils )
- Validate Data in Singup API 
- Install bcrypt library 
- Create passowrdhash using bcrypt.hash & save a user with encrypted password 


Validate (Email & Password ) - Login 

- Create Login API 
- Compare password & throw errors if email or passowrd Invalid 



Authentication, JWT & Cookies 

- Install cookie-parse 
- Just send a dummy cookie to user 
- Create Get /profile API & check if you get the cookie back 
- Install jsonwebtoken 
- IN login API , after email & password , create a JWT Token & send it to the user 
- read the cookies inside your profile API & find the logged in user 

- userAuth Middleware 
- Add the userAuth Middleware in profile api & a new sendConnectionRequest API 
- set the expiry of JWT token & cookies to 7 days 


- Create userSchema method to getJWT()
- Create userSchema method to comparepassword(password)


- Explore Tinder APIs
- Create a list all API you can think of in  Dev Tinder 
- Group multiple routes & under repective routers 
- Read documentation for express.Router
- Create routes folder managing auth,profile,request routers
- Create authRouter, profileRouter, requestRouter
- Import these routers in app.js

- Create POST /Logout API
- Create PATCH /profile/edit 
- Create PATCH /profile/password   ==> Forgot Password API 
- Test All APIs

- # Reminder : Check all the case corners !!

- Define the Schema connectionRequest (fromuserID, toUserid,enum(Status) , timestamp(Check time request ))

- Create Post  API(fromUserId(userAuth,id ), toUserId(params), status(Dynamic))

- Validate the status(Intrested  , Ignored)
- Check the connectioon Request between the (sender, receiver) - Reject (Existing connectionRequest)

- Checked if the ID is available on the database (Check Existing connectionRequest & handle the connection)

- Check The Params (userId)

- Modify the response for each connection (Intrested, Ignored )

# ref, Populate & Thought process of writing APIs

- Write code with proper validation for this API : POST /request/review/:status/:toUserId
- Thoughts process - POST /  GET


# Tasks : 
- Read $or & $and Query in mongoose 
- Read more about indexes in mongoDB 
- Why do we need index in DB 
- What is the advantage & disadvantage of creating ? 


# API : User

- GET /user/requests/received - Fetch all the user's requests
- Read about Ref & populate
- Create this API :  GET /user/connections

# Feed API & Pagination

- Logic for GET /feedd API 
- Explore the $nin , $and  & other methods 

----- -------- -------- ----------- ---------- ----- 
-  User should all the user cards except 
- 0. His own card 
- 1. His connections 

- 2. ignored people 

- 3. Already sent the connection request 


-  Example : Youssef = [Saad,charifa, Nour,Fouzia,Ahmed] 

- Y > Ayman  > Rejected , Y > Fatiha  > Accepted

-  Find all connection requests (sent + received)


# Pagination

- /feed?page=1&limit=10 => first 10users 1-10
- /feed.page=2&limit=10 => 11-20
- /feed.page=3&limit=10 => 21-30 ==> .skip(20) .limit(10)



# Create React Project 

- npm create vite@latest devTinder-web -- --template react.



# Scheduling cron  Jobs in NodeJS

- Installing node-cron 
- Learning about cron expressions syntax - crontab.guru
- Schedule a job
- date-fns 
- Find all the unique email Id who have got connection request in previous day 
- Send email 
- Explore queue mechanim to send bulk emails 
- Amazon SES bulk Emails 
- Make sendEmail function