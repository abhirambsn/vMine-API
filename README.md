# vMine API

## Environment Variables Required

1. MONGO_URI - MongoDB Connection String
2. PORT - Port on which Server should run (default 3000 if not specified)
3. JWT_SECRET - Json Web Token Secret Key
4. JWT_EXPIRES_IN - No of seconds, the validity of one JWT
5. UPLOAD_PATH - Path where uploaded files will be stored
6. LOG_PATH - Path where application logs will be stored
7. G_CLIENT_ID - Client ID of the Gmail ID which would be used
8. G_CLIENT_SECRET - Secret ID of the Gmail ID
9. G_REFRESH_TOKEN - Refresh Token of the Gmail ID taken from OAuth Playgroud
10. G_EMAIL - Email ID to be used

**For values of variables from 7 to 10 refer to this [Website](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/)**

## Routes
### Auth
1. **POST: /api/auth/login**
    - username: String
    - password: String

2. **POST: /api/auth/register**
    - name: String
    - username: String
    - password: String
    - profilePic: File (Picture)
    - bio: String

3. **POST: /api/auth/changePassword**
    - oldPassword: String
    - newPassword1: String
    - newPassword2: String

4. **GET: /api/auth/profile OR /api/auth/profile/username**: Returns the profile of the current user or the user with the given username

5. **GET: /api/auth/verify/{token}**: Verifies the profile of the user with given token

6. **DELETE: /api/auth/delete**: Deletes the current user's account

### Posts
1. **POST: /api/post/**
    - title: String,
    - caption: String
    - content: String
    - pictures: Files

2. **POST: /api/post/{post_id}/comment**
    - comment: String

3. **POST: /api/post/{post_id}/{comment_id}/reply**
    - comment: String

4. **GET: /api/post/**: Get All Posts
5. **GET: /api/post/{post_id}**: Get The details of the particular post id
6. **GET: /api/post/{post_id}/like**: Likes the post with the parameter post id
7. **GET: /api/post/{post_id}/noLikes**: Get's the no of likes on the given post id
8. **GET: /api/post/{post_id}/{comment_id}**: Retrieves all the comments on the Give post id
9. **GET: /api/post/{post_id}/{comment_id}/reply**: Retrieves all the replies on that given comment of the given post

#### Made By: B.S.N. Abhiram
#### Email: abhirambsn@gmail.com
#### GitHub: [@abhirambsn](https://github.com/abhirambsn)