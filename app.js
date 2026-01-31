//app.js

// For Environment Variables
require('dotenv').config();
// Express Stuff
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();


// Routing
const routes = require('./routes');

app.get('/', (req, res) => {
  res.send('Homepage');
});

app.use('/users', routes.usersRoutes);
app.use('/posts', routes.postsRoutes);

app.listen(PORT, () => {
  console.log(`Now listening to port:`, PORT);
})