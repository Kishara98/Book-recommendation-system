const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT  = process.env.PORT || 5000;

// Initialize env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

