# blog-api
An API used in a blog app, serves blog data to the client, has a route to login and three main resources/route: users, posts, and comments.

Uses api versioning with the main path being `/api/v1/`

# Auth Route
### `POST api/v1/auth/login`
Accepts a payload of req.body that has `email` and `password` of a user
Returns a JSON with the JWT token for the client to store

# Users Route
### `POST api/v1/users`


