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

//dinner
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


//dessert
const DessertFolderPath = path.join(dataFolderPath, 'Dessert.json');

// Define the route handler
app.get('/api/dessert',(req,res)=>{
    res.send('You are in the DESSERT route')
});

app.get('/api/dessert/Dessert_Menu', (req, res) => {
    fs.readFile(DessertFolderPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading Dessert file', err);
            return res.status(500).send('Error loading dessert recipe...');
        }
        // Send the response with the file contents
        res.send(data);
    });
});

app.post('/api/dessert/addNewRecipe', (req, res) => {
    // Read the existing recipes
    fs.readFile(DessertFolderPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Dessert.json:', err);
            return res.status(500).send('Error reading Dessert recipes');
        }

        try {
            // Parse the JSON data
            const dessertRecipes = JSON.parse(data);

            // Validate if all required fields are provided
            const requiredFields = ['name', 'category', 'ingredients', 'instructions'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).send(`Incomplete recipe data. Please provide ${field}.`);
                }
            }

            // Construct the new recipe object
            const newRecipe = {
                name: req.body.name,
                category: req.body.category,
                ingredients: req.body.ingredients,
                instructions: req.body.instructions
            };

            // Add the new recipe to the existing recipes
            dessertRecipes.push(newRecipe);

            // Write the updated recipes back to the file
            fs.writeFile(DessertFolderPath, JSON.stringify(dessertRecipes, null, 4), (err) => {
                if (err) {
                    console.error('Error writing Dessert.json:', err);
                    return res.status(500).send('Error writing dessert recipes');
                }
                res.status(201).send(`${newRecipe.name} added to dessert recipes successfully`);
            });
        } catch (error) {
            console.error('Error parsing dessert.json:', error);
            res.status(500).send('Error parsing dessert recipes');
        }
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
app.delete('/api/dessert/deleteRecipe/:name', (req, res) => {
    const recipeName = req.params.name;

    // Read the existing recipes
    fs.readFile(DessertFolderPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Dessert file:', err);
            return res.status(500).send('Error loading dessert recipes.');
        }

        try {
            dessertRecipes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing Dessert recipes:', error);
            return res.status(500).send('Error parsing dessert recipes.');
        }

        // Find the index of the recipe to be deleted
        const recipeIndex = dessertRecipes.findIndex(recipe => recipe.name === recipeName);

        if (recipeIndex === -1) {
            return res.status(404).send('Recipe not found.');
        }

        // Remove the recipe from the array
        const deletedRecipe = dessertRecipes.splice(recipeIndex, 1)[0];

        // Write the updated recipes back to the file
        fs.writeFile(DessertFolderPath, JSON.stringify(dessertRecipes, null, 2), (err) => {
            if (err) {
                console.error('Error writing Dessert.json:', err);
                return res.status(500).send('Error writing dessert recipes.');
            }
            res.send(`Recipe "${deletedRecipe.name}" deleted successfully!`);
        });
    });
});

const lunchFilePath = path.join(dataFolderPath, 'lunch.json');
//lunch
app.get('/', (req, res) => {
    res.send('You are in the Lunch route');    
});

app.get('/api/lunch', validateUser, (req, res) => {

    fs.readFile(lunchFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading lunch.json:', err);
            res.status(500).send('Error reading lunch recipes');
            return;
        }

        try {
            
            const lunchRecipes = JSON.parse(data);
            res.json(lunchRecipes);
        } catch (error) {
            console.error('Error parsing lunch.json:', error);
            res.status(500).send('Error parsing lunch recipes');
        }
    });
});

app.get('/api/lunch/:name', validateUser, (req, res) => {
    const recipeName = req.params.name;
    fs.readFile(lunchFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading lunch.json:', err);
            res.status(500).send('Error reading lunch recipes');
            return;
        }

        try {
            
            const lunchRecipes = JSON.parse(data);

            const recipe = lunchRecipes.find(recipe => recipe.name === recipeName);

            if (!recipe) {
                return res.status(404).send('The recipe with the given name was not found.');
            }
            res.json(recipe);

        } catch (error) {
            console.error('Error parsing lunch.json:', error);
            res.status(500).send('Error parsing lunch recipes');
        }
    });
});

app.post('/api/lunch/addNewRecipe', validateUser, (req, res) => {
    const newRecipe = req.body;
    if(!newRecipe.name || !newRecipe.ingredients || !newRecipe.instructions) {
        return res.status(400).send('Incomplete recipe data. Please provide name, ingredient and instructions.');
    }

    fs.readFile(lunchFilePath, 'utf8', (err, data) =>{
        if(err){
            console.error('Error reading Lunch File:', err);
            res.status(500).send('Error reading lunch Recipes');
        }

        let lunchRecipes = []
        try {
            lunchRecipes = JSON.parse(data);
        } catch(error) {
            console.error('Error parsing Lunch recipes:', error);
            return res.status(500).send('Error parsing lunch recipes');
        }

            lunchRecipes.push(newRecipe);

            fs.writeFile(lunchFilePath, JSON.stringify(lunchRecipes, null, 4), (err) => {
                if(err) {
                    console.error('Error writing lunch.json:', err);
                    res.status(500).send('Error writing lunch Recipes');
                    return;
                }
                res.status(201).send(`Recipe added to lunch recipes successfully`);
            });
        }); 
    });

    app.put('/api/lunch/editRecipe/:recipeId', (req, res) => {
        const recipeId = req.params.recipeId;
        const updatedRecipe = req.body;
    
        if (!updatedRecipe.name || !updatedRecipe.ingredients || !updatedRecipe.instructions || !updatedRecipe.category) {
            return res.status(400).send('Incomplete recipe data. Please provide name, ingredients, instructions, and category.');
        }
    
        // Read the existing recipes
        fs.readFile(lunchFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading Lunch file:', err);
                return res.status(500).send('Error loading lunch recipes.');
            }
    
            let lunchRecipes = [];
            try {
                lunchRecipes = JSON.parse(data);
            } catch (error) {
                console.error('Error parsing Lunch recipes:', error);
                return res.status(500).send('Error parsing lunch recipes.');
            }
    
            // Find the recipe by ID
            const recipeIndex = lunchRecipes.findIndex(recipe => recipe.recipeId === parseInt(recipeId));
    
            if (recipeIndex === -1) {
                return res.status(404).send('Recipe not found.');
            }
    
            // Update the recipe
            lunchRecipes[recipeIndex] = {
                recipeId: parseInt(recipeId),
                name: updatedRecipe.name,
                category: updatedRecipe.category,
                ingredients: updatedRecipe.ingredients,
                instructions: updatedRecipe.instructions
            };
    
            fs.writeFile(lunchFilePath, JSON.stringify(lunchRecipes, null, 2), (err) => {
                if (err) {
                    console.error('Error writing lunch.json:', err);
                    return res.status(500).send('Error writing lunch recipes.');
                }
                res.status(200).send('Recipe updated successfully.');
            });
        });
    });
    

app.delete('/api/lunch/deleteRecipe/:recipeId', validateUser, (req, res) => {
    const recipeId = req.params.recipeId;

    fs.readFile(lunchFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Lunch file:', err);
            return res.status(500).send('Error loading lunch recipes.');
        }

        let lunchRecipes = [];
        try {
            lunchRecipes = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing Lunch recipes:', error);
            return res.status(500).send('Error parsing lunch recipes.');
        }

        const recipeIndex = lunchRecipes.findIndex(recipe => recipe.recipeId === parseInt(recipeId));

        if (recipeIndex === -1) {
            return res.status(404).send('Recipe not found.');
        }

        lunchRecipes.splice(recipeIndex, 1);

        fs.writeFile(lunchFilePath, JSON.stringify(lunchRecipes, null, 2), (err) => {
            if (err) {
                console.error('Error writing lunch.json:', err);
                return res.status(500).send('Error writing lunch recipes.');
            }
            res.status(200).send('Recipe deleted successfully.');
        });
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
