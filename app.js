const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const { v4: uuidv4 } = require('uuid');

// Path to the data folder
const dataFolderPath = path.join(__dirname, 'data');
// Path to the breakfast.json file
const breakfastFilePath = path.join(dataFolderPath, 'breakfast.json');

function authenticateUser(username, password) {
    // Check if username and password are valid
    return username === 'admin' && password === 'admin';
}

// Middleware for user validation
function validateUser(req, res, next) {
    const { username, password } = req.headers;

    // Check if username and password are provided in the request headers
    if (!username || !password) {
        return res.status(401).send('Authentication required. Please provide username and password.');
    }

    // Authenticate user
    if (!authenticateUser(username, password)) {
        return res.status(401).send('Invalid username or password.');
    }
    // If user is validated, proceed to the next middleware or route handler
    next();
}

app.get('/', (req, res) => {
    res.send("RECIPE SHARING API");
});

// Route to get breakfast recipes
app.get('/api/breakfast', validateUser, (req, res) => {
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

app.get('/api/breakfast/:name', validateUser, (req, res) => {
    const recipeName = req.params.name;
    fs.readFile(breakfastFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading breakfast.json:', err);
            res.status(500).send('Error reading breakfast recipes');
            return;
        }

        try {
            // Parse the JSON data
            const breakfastRecipes = JSON.parse(data);

            // Find the recipe with the given name
            const recipe = breakfastRecipes.find(recipe => recipe.name === recipeName);

            if (!recipe) {
                return res.status(404).send('The recipe with the given name was not found.');
            }
            res.json(recipe);

        } catch (error) {
            console.error('Error parsing breakfast.json:', error);
            res.status(500).send('Error parsing breakfast recipes');
        }
    });
});

// Route to add a new recipe to breakfast.json file
app.post('/api/breakfast/addNewRecipe', validateUser, (req, res) => {
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

            // Validate if all required fields are provided
            const requiredFields = ['name', 'category', 'ingredients', 'instructions'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).send(`Incomplete recipe data. Please provide ${field}.`);
                }
            }

            // Add the new recipe to the array with a unique id
            const newRecipe = {
                id: uuidv4(), // Generate a unique id
                ...req.body
            };

            breakfastRecipes.push(newRecipe);

            // Write the updated recipes back to the file
            fs.writeFile(breakfastFilePath, JSON.stringify(breakfastRecipes, null, 4), (err) => {
                if (err) {
                    console.error('Error writing breakfast.json:', err);
                    res.status(500).send('Error writing breakfast recipes');
                    return;
                }
                res.status(201).send(`${newRecipe.name} added to breakfast recipes successfully`);
            });
        } catch (error) {
            console.error('Error parsing breakfast.json:', error);
            res.status(500).send('Error parsing breakfast recipes');
        }
    });
});

// Route to modify a recipe
app.put('/api/breakfast/modify/:name', validateUser, (req, res) => {
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

            // Update the recipe with the given name
            const modifiedRecipe = {
                ...breakfastRecipes[recipeIndex], // Keep existing properties
                name: req.body.name || breakfastRecipes[recipeIndex].name,
                category: req.body.category || breakfastRecipes[recipeIndex].category,
                ingredients: req.body.ingredients || breakfastRecipes[recipeIndex].ingredients,
                instructions: req.body.instructions || breakfastRecipes[recipeIndex].instructions,
            };

            // Update the recipe in the array
            breakfastRecipes[recipeIndex] = modifiedRecipe;

            // Write the updated recipes back to the file
            fs.writeFile(breakfastFilePath, JSON.stringify(breakfastRecipes, null, 4), (err) => {
                if (err) {
                    console.error('Error writing breakfast.json:', err);
                    res.status(500).send('Error writing breakfast recipes');
                    return;
                }
                res.send(`Recipe "${recipeName}" modified successfully!`);
            });
        } catch (error) {
            console.error('Error parsing breakfast.json:', error);
            res.status(500).send('Error parsing breakfast recipes');
        }
    });
});

// Route to delete a recipe by its name
app.delete('/api/breakfast/delete/:name', validateUser, (req, res) => {
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
            fs.writeFile(breakfastFilePath, JSON.stringify(breakfastRecipes, null, 4), (err) => {
                if (err) {
                    console.error('Error writing breakfast.json:', err);
                    res.status(500).send('Error writing breakfast recipes');
                    return;
                }
                res.send(`Recipe "${deletedRecipe.name}" deleted successfully!`);
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
