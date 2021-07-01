# vMine API
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
#### GitHub: @abhirambsn