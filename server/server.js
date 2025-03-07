const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 8000;
app.use(cors());
Vocab = require("./api/models/vocabModel");
const vocabroute= require("./api/routes/vocabRoutes");


app.use(express.json()); // Middleware to parse JSON

app.use("/",vocabroute);
 
app.listen(port, () => console.log(`Server running on port ${port}`));


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/link-storage')
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

 
