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
const dataFolderPath = path.join(__dirname, 'Dessert.json');

// Define the route handler
app.get('/api/Dessert',(req,res)=>{
    res.send('You are in the DESSERT route')
});

app.get('/api/dessert/Dessert_Menu', (req, res) => {
    fs.readFile(DessertFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading Dessert file', err);
            return res.status(500).send('Error loading dessert recipe...');
        }
        // Send the response with the file contents
        res.send(data);
    });
});

app.post('/api/dessert/addNewRecipe',  (req, res) => {
    const newRecipe = req.body;
    if (!newRecipe.name || !newRecipe.ingredients || !newRecipe.instructions) {
        return res.status(400).send('Incomplete recipe data. Please provide name, ingredients, and instructions.');
    }

    // Read the existing recipes
    fs.readFile(DessertFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Dessert file:', err);
            return res.status(500).send('Error loading dessert recipes.');
        }

        let DessertRecipes = [];
        try {
            DessertRecipes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing Dessert recipes:', error);
            return res.status(500).send('Error parsing dessert recipes.');
        }

        // Add the new recipe to the array
        DessertRecipes.push(newRecipe);

        // Write the updated recipes back to the file
        fs.writeFile(DessertFilePath, JSON.stringify(DessertRecipes, null, 2), (err) => {
            if (err) {
                console.error('Error writing Dessert.json:', err);
                return res.status(500).send('Error writing dessert recipes.');
            }
            res.status(201).send('Recipe added to dessert recipes successfully.');
        });
    });
});

//Edit recipe
app.put('/api/dessert/editRecipe/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId;
    const updatedRecipe = req.body;

    if (!updatedRecipe.name || !updatedRecipe.ingredients || !updatedRecipe.instructions || !updatedRecipe.category) {
        return res.status(400).send('Incomplete recipe data. Please provide name, ingredients, instructions, and category.');
    }

    // Read the existing recipes
    fs.readFile(DessertFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Dessert file:', err);
            return res.status(500).send('Error loading dessert recipes.');
        }

        let DessertRecipes = [];
        try {
            DessertRecipes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing Dessert recipes:', error);
            return res.status(500).send('Error parsing dessert recipes.');
        }

        // Find the recipe by ID
        const recipeIndex = DessertRecipes.findIndex(recipe => recipe.recipeId === parseInt(recipeId));

        if (recipeIndex === -1) {
            return res.status(404).send('Recipe not found.');
        }

        // Update the recipe
        DessertRecipes[recipeIndex] = {
            recipeId: parseInt(recipeId),
            name: updatedRecipe.name,
            category: updatedRecipe.category,
            ingredients: updatedRecipe.ingredients,
            instructions: updatedRecipe.instructions
        };

        fs.writeFile(DessertFilePath, JSON.stringify(DessertRecipes, null, 2), (err) => {
            if (err) {
                console.error('Error writing Dessert.json:', err);
                return res.status(500).send('Error writing dessert recipes.');
            }
            res.status(200).send('Recipe updated successfully.');
        });
    });
});

// Delete recipe
app.delete('/api/dessert/deleteRecipe/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId;

    // Read the existing recipes
    fs.readFile(DessertFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Dessert file:', err);
            return res.status(500).send('Error loading dessert recipes.');
        }

        let DessertRecipes = [];
        try {
            DessertRecipes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing Dessert recipes:', error);
            return res.status(500).send('Error parsing dessert recipes.');
        }

        // Find the index of the recipe to be deleted
        const recipeIndex = DessertRecipes.findIndex(recipe => recipe.recipeId === parseInt(recipeId));

        if (recipeIndex === -1) {
            return res.status(404).send('Recipe not found.');
        }

        // Remove the recipe from the array
        DessertRecipes.splice(recipeIndex, 1);

        // Write the updated recipes back to the file
        fs.writeFile(DessertFilePath, JSON.stringify(DessertRecipes, null, 2), (err) => {
            if (err) {
                console.error('Error writing Dessert.json:', err);
                return res.status(500).send('Error writing dessert recipes.');
            }
            res.status(200).send('Recipe deleted successfully.');
        });
    });
});

//port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});