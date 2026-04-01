# blog-api
An API used in a blog app, serves blog data to the client, has a route to login and three main resources/route: users, posts, and comments.

Uses api versioning with the main path being `/api/v1/`

# Auth Resource
### `POST /api/v1/auth/login`
Route to access to authorize a user and request access to protected routes.
Accepts a required payload of req.body that has `email` and `password` of a user.
Returns a JSON with the JWT token for the client to store.

# Users Resource
### `POST /api/v1/users`
Route to access to create/register a user to the database
Accepts a required payload of req.body that has fields of: `email`, `password`, `confirm-password`,`firstName`, `lastName`, `isAuthor`, `isAdmin`(optional)
Redirects to `GET api/v1/users/:userId` of the created user

### Protected Routes
#### `GET /api/v1/users?query=string`
Shows list of all users
Accepts optional query strings such as: `email` , `firstName` , `lastName` , `isAuthor`, `isAdmin`,  `numberOfPosts`, `numberOfComments`, `sort`, `mode`, `page`

The query string's possible values:
- email: string
- firstName: string
- lastName: string
- isAuthor: boolean
- isAdmin: boolean
- numberOfPosts: Int/Number
- numberOfCommments: Int/Number

`sort` query string's possible values: symbol(+/-) with `email`, `firstName`, `lastName`, `isAuthor`, `isAdmin`, `posts`, `comments`
`mode` query string's possible values: `or`, `not`, `and`
`page` query string's possible values: Number values

Returns all data of the users in the database or the filtered data of users that satisfies the query strings conditions if present
Includes related records such as: `posts`, `comments` and `liked_comments`

#### `GET /api/v1/users/:userId`
Shows data for the user with userId of `:userId` 
Includes related records such as: `posts`, `comments` and `liked_comments`

#### `PUT /api/v1/users/:userId`
Updates the data for the user  with userId of `:userId`
Accepts payload of at least one on the req.body: `email`, `password`, `confirm-password`,`firstName`, `lastName`, `isAuthor`, `isAdmin`, `likedComments`, `dislikedComments`
Accepted values:
- `email`: string/valid email
- `password`: string
- `confirm_password`: string/must be same as the password field
- `firstName`: string
- `lastName`: string
- `isAuthor`: boolean
- `isAdmin`: boolean
- `likedComments` : Int/id of the comment record
- `dislikedComment` : Int/id of the comment record
Returns a JSON success message when no error occurs

#### `DELETE /api/v1/users/:userId`
Deletes the data for the user with userId of `:userId`
Returns a JSON success message when no error occurs

# Posts Resource
- `:postId` uses UUID format for the public id

### `GET /api/v1/posts?query=string`
Shows the list of all posts or posts that satisfies the optional query string condition
Accepts optional query strings such as:
- `title`: string
- `text` : string
- `isPublished` : boolean
- `dateFrom` : date: format(YYYY-MM-DD)
- `dateTo`: date: format(YYYY-MM-DD)
- `authorFirstName` : string
- `authorLastName` : string
- `numberOfComments` : Int/Number

- `sort` : symbol(+/-) with the values of above (i.e +title, -text) such as:
    - `title`
    - `text`
    - `isPublished`
    - `createdAt`
    - `updatedAt`
    - `comments`
- `page` : Int/Number
- `mode` : or/not/and

Returns filtered JSON data of all the posts or posts that satisfies the optional queries

### `GET /api/v1/posts/:postId`
Shows data for the post of `:postId`
Returns filtered JSON data, includes related record of comments which are also filtered

### Protected Routes
#### `POST /api/v1/posts`
Creates a post based on the current logged in user data(id) and required payload of data from req.body such as:
- `title` : string
- `text` : string
- `isPublished` : boolean
- Uses data from the current logged in user `req.user` to get the id
Redirects to the newly created post `GET /api/v1/posts/:postId` when successful

#### `PUT /api/v1/posts/:postId`
Updates for the post of `:postId`
Requires payload data of at least one from req.body such as:
- `title` : string
- `text` : string
- `isPublished` : boolean
Returns a success message when updating successfuly

#### `DELETE /api/v1/posts/:postId`
Deletes the post `:postId`
Returns a success message when deleting succesfully

# Comments Resource
- `:postId` uses UUID format of the post's public id
- `:commentId` uses UUID format of the comment's public id

### `GET /api/v1/posts/:postId/comments?query=string`
Shows all comments of a posts or based on the condition of the optional query string such as:
- `text` : string
- `dateFrom` : date: format(YYYY-MM-DD)
- `dateTo`: date: format(YYYY-MM-DD)
- `mode` : or/not/and
- `page` : numeric value
- `sort` : (+/-) symbol with values (i.e +text)such as:
     - `text`
     - `createdAt`
     - `updatedAt`
     - `likes`

Returns filtered JSON data of all the comments or data based on the query strings

### `GET /api/v1/posts/:postId/comments/:commentId`
Show the comment of the post (:postId) based on the comment's public id (:commentId)

Returns JSON data of the specified comment

### Protected Routes
#### `POST /api/v1/posts/:postId/comments`
Create a comment on the specified post based on the current logged in user (id) and required payload of data from req.body such as:
- `text` : string
Redirects to the created comment on the post `GET /api/v1/posts/:postId/comments/:commentId`

#### `PUT /api/v1/posts/:postId/comments/:commentId`
Update the text of a comment on the specified post (:postId) based on the comment's public id (:commentId)
Requires payload of data from req.body such as:
- `text` : string
Returns a success message when updating succesfully

#### `DELETE /api/v1/posts/:postId/comments/:commentId`
Delete the comment of a specified post (:postId) based on the comment's public id (:commentId)
Returns a success message when deleted succesfully