const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

// Path to the data folder
const dataFolderPath = path.join(__dirname, 'data');
// Path to the breakfast.json file
const breakfastFilePath = path.join(dataFolderPath, 'breakfast.json');

// Route to get breakfast recipes
app.get('/api/breakfast', (req, res) => {
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

// Route to add a new recipe to breakfast.json file
app.post('/api/breakfast/addNewRecipe', (req, res) => {
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
// Route to delete a recipe by its name
app.delete('/api/breakfast/:name', (req, res) => {
    const recipeName = req.params.name;

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

            // Find the index of the recipe with the given name
            const recipeIndex = breakfastRecipes.findIndex(recipe => recipe.name === recipeName);

            if (recipeIndex === -1) {
                return res.status(404).send('The recipe with the given name was not found.');
            }

            // Remove the recipe from the array
            const deletedRecipe = breakfastRecipes.splice(recipeIndex, 1)[0];

            // Write the updated recipes back to the file
            fs.writeFile(breakfastFilePath, JSON.stringify(breakfastRecipes, null, 2), (err) => {
                if (err) {
                    console.error('Error writing breakfast.json:', err);
                    res.status(500).send('Error writing breakfast recipes');
                    return;
                }
                res.send(deletedRecipe);
            });
        } catch (error) {
            console.error('Error parsing breakfast.json:', error);
            res.status(500).send('Error parsing breakfast recipes');
        }
    });
});


//lunch - Kenneth
app.get('/api/lunch', (req, res) => {
    res.send('You are in the LUNCH route');
});

//dinner - Myca
app.get('/api/dinner', (req, res) => {
    res.send('You are in the DINNER route');
});

//dessert - Johanna
app.get('/api/dessert', (req, res) => {
    res.send('You are in the DESSERT route');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
