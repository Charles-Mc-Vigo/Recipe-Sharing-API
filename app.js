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

    
    
});
app.get('/api/dinner/dinner_Menu', (req, res) => {
    fs.readFile(DinnerFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading Dinner file', err);
            return res.status(500).send('Error loading dinner recipe...');
        }
        // Send the response with the file contents
        res.send(data);
    });
});

app.post('/api/dinner/addNewRecipe',  (req, res) => {
    const newRecipe = req.body;
    if (!newRecipe.name || !newRecipe.ingredients || !newRecipe.instructions) {
        return res.status(400).send('Incomplete recipe data. Please provide name, ingredients, and instructions.');
    }

    // Read the existing recipes
    fs.readFile(DinnerFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Dinner file:', err);
            return res.status(500).send('Error loading dinner recipes.');
        }

        let DinnerRecipes = [];
        try {
            DinnerRecipes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing Dinner recipes:', error);
            return res.status(500).send('Error parsing dinner recipes.');
        }

        // Add the new recipe to the array
        DinnerRecipes.push(newRecipe);

        // Write the updated recipes back to the file
        fs.writeFile(DinnerFilePath, JSON.stringify(DinnerRecipes, null, 2), (err) => {
            if (err) {
                console.error('Error writing Dinner.json:', err);
                return res.status(500).send('Error writing dinner recipes.');
            }
            res.status(201).send('Recipe added to dinner recipes successfully.');
        });
    });
});


//Edit recipe
app.put('/api/dinner/editRecipe/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId;
    const updatedRecipe = req.body;

    if (!updatedRecipe.name || !updatedRecipe.ingredients || !updatedRecipe.instructions || !updatedRecipe.category) {
        return res.status(400).send('Incomplete recipe data. Please provide name, ingredients, instructions, and category.');
    }

    // Read the existing recipes
    fs.readFile(DinnerFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Dinner file:', err);
            return res.status(500).send('Error loading dinner recipes.');
        }

        let DinnerRecipes = [];
        try {
            DinnerRecipes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing Dinner recipes:', error);
            return res.status(500).send('Error parsing dinner recipes.');
        }

        // Find the recipe by ID
        const recipeIndex = DinnerRecipes.findIndex(recipe => recipe.recipeId === parseInt(recipeId));

        if (recipeIndex === -1) {
            return res.status(404).send('Recipe not found.');
        }

        // Update the recipe
        DinnerRecipes[recipeIndex] = {
            recipeId: parseInt(recipeId),
            name: updatedRecipe.name,
            category: updatedRecipe.category,
            ingredients: updatedRecipe.ingredients,
            instructions: updatedRecipe.instructions
        };

        fs.writeFile(DinnerFilePath, JSON.stringify(DinnerRecipes, null, 2), (err) => {
            if (err) {
                console.error('Error writing Dinner.json:', err);
                return res.status(500).send('Error writing dinner recipes.');
            }
            res.status(200).send('Recipe updated successfully.');
        });
    });
});

// Delete recipe
app.delete('/api/dinner/deleteRecipe/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId;

    // Read the existing recipes
    fs.readFile(DinnerFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Dinner file:', err);
            return res.status(500).send('Error loading dinner recipes.');
        }

        let DinnerRecipes = [];
        try {
            DinnerRecipes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing Dinner recipes:', error);
            return res.status(500).send('Error parsing dinner recipes.');
        }

        // Find the index of the recipe to be deleted
        const recipeIndex = DinnerRecipes.findIndex(recipe => recipe.recipeId === parseInt(recipeId));

        if (recipeIndex === -1) {
            return res.status(404).send('Recipe not found.');
        }

        // Remove the recipe from the array
        DinnerRecipes.splice(recipeIndex, 1);

        // Write the updated recipes back to the file
        fs.writeFile(DinnerFilePath, JSON.stringify(DinnerRecipes, null, 2), (err) => {
            if (err) {
                console.error('Error writing Dinner.json:', err);
                return res.status(500).send('Error writing dinner recipes.');
            }
            res.status(200).send('Recipe deleted successfully.');
        });
    });
});




// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




