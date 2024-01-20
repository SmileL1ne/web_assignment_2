const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// User weather router to handler weather related queries
const weather = require('./routes/weather')
app.use(weather)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
