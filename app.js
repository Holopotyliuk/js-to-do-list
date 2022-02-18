const express = require('express');
const app = express();
const cors=require('cors')
const router=require('./server/routes/rout.js')
app.use(cors());
app.use(express.json())
app.use(router)
module.exports=app