const express = require('express');
const app = express();
const path = require('path'); // Import the path module
const fs = require('fs');
app.use(express.json());

app.get('/api',(req,res)=>{
    res.send('Welcome to Recipe Sharing API')
})

//breakfast
// Path to the data folder
const dataFolderPath = path.join(__dirname, 'data');

app.get('/api/breakfast', (req, res) => {
    // Path to the breakfast.json file
    const breakfastFilePath = path.join(dataFolderPath, 'breakfast.json');
    
    // Read the breakfast.json file
    fs.readFile(breakfastFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading breakfast.json:', err);
            res.status(500).send('Error reading breakfast recipes');
            return;
        }

        try {
            // Parse the JSON data
            const breakfastRecipes = JSON.parse(data);
            res.json(breakfastRecipes);
        } catch (error) {
            console.error('Error parsing breakfast.json:', error);
            res.status(500).send('Error parsing breakfast recipes');
        }
    });
});

app.post('/api/breakfast/addNewRecipe', (req, res) => {
    // Path to the breakfast.json file
    const breakfastFilePath = path.join(dataFolderPath, 'breakfast.json');

    // Read the existing recipes
    fs.readFile(breakfastFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading breakfast.json:', err);
            res.status(500).send('Error reading breakfast recipes');
            return;
        }

        try {
            // Parse the JSON data
            const breakfastRecipes = JSON.parse(data);

            // Add the new recipe to the array
            const newRecipe = req.body;
            breakfastRecipes.push(newRecipe);

            // Write the updated recipes back to the file
            fs.writeFile(breakfastFilePath, JSON.stringify(breakfastRecipes, null, 2), (err) => {
                if (err) {
                    console.error('Error writing breakfast.json:', err);
                    res.status(500).send('Error writing breakfast recipes');
                    return;
                }
                res.status(201).send('Recipe added to breakfast recipes successfully');
            });
        } catch (error) {
            console.error('Error parsing breakfast.json:', error);
            res.status(500).send('Error parsing breakfast recipes');
        }
    });
});
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