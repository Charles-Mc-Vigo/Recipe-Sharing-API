const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
app.use(express.json());

const dataFolderPath = path.join(__dirname, 'data');


function authenticateUser(username, password) {
    return username === 'admin' && password === 'admin';
}

function validateUser(req, res, next){
    const{ username, password} = req.headers;

    if (!username || !password){
        return res.status(401).send('Authentication required. Please provide username and password');
    }
    next();
}

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





//dinner
app.get('/api/dinner',(req,res)=>{
    res.send('You are in the DINNER route')
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