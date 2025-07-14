# DevTinder APIs

# AuthRouter  

- POST /auth/singup
- POST /auth/login 
- POST /auth/logout 

# ProfileRouter

- GET /profile/view
- PATCH /profile/edit 
- PATCH /profile/password  // Forgot Password API 

# ConnectionRequest  Router 

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

# userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profile of other users platform 


# Account : 
fStatus : Ignore , Intreseted, accepted , rejected


