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

// path folder
const dataFolderPath = path.join(__dirname, 'data');
const DinnerFilePath = path.join(dataFolderPath, 'Dinner.json');

// Define the route handler
app.get('/api/dinner', (req, res) => {

    res.send('You are in the Dinner route');

    const buttonHtml = '<a href="/api/dinner/dinner_Menu"><button>View Dinner Menu</button></a>';
    
});
app.get ('/api/dinner/dinner_Menu',(req,res)=>{
    fs.readFile(DinnerFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading Dinner file');
            res.status(500).send('Error loading dinner recipe...');
            return;
        }

        // Send the response with the file contents
        res.send(data);
    });

})

//dessert
app.get('/api/dessert',(req,res)=>{
    res.send('You are in the DESSERT route')
})


//port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});