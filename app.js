const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
app.use(express.json());

app.get('/api',(req,res)=>{
    res.send('Welcome to Recipe Sharing API')
})

//breakfast
app.get('/api/breakfast',(req, res)=>{
    res.send('You are in the Breakfast route')
})

//lunch
app.get('/api/lunch',(req,res)=>{
    res.send('You are in the LUNCH route')
})

//dinner
app.get('/api/dinner',(req,res)=>{
    res.send('You are in the DINNER route')
})

//dessert
app.get('/api/dessert',(req,res)=>{
    res.send('You are in the DESSERT route')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});