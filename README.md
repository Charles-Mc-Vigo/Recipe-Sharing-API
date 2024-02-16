# Recipe Sharing API

## Group Name: DevGurus

### Members:
- Johanna Mae Ferrer
- Myca Magallanes
- Charles Mc Vigo
- Kenneth Paul Montero

## Overview
The Recipe Sharing API is a web service that allows users to share, create, modify, and delete recipes. It provides endpoints for managing breakfast, lunch, dinner, and dessert recipes and includes features such as authentication, recipe retrieval, addition, modification, and deletion.

## Purpose
The purpose of this project is to create a platform where users can share their favorite recipes with others. It aims to facilitate recipe sharing and collaboration among food enthusiasts.

## Features
- User authentication
- Get all recipes for breakfast, lunch, dinner, and dessert
- Get a specific recipe by name or id for each category
- Add a new recipe for each category
- Modify an existing recipe for each category
- Delete a recipe for each category

## Dependencies
- Node.js
- Express.js
- uuid

## Setup
1. Clone the repository:
2. Install dependencies:
3. Run the server:
4. Access the API endpoints using Postman or any other API testing tool.

## API Endpoints
- **GET /api/breakfast**: Get all breakfast recipes.
- **GET /api/breakfast/:name**: Get a specific breakfast recipe by name.
- **POST /api/breakfast/addNewRecipe**: Add a new breakfast recipe.
- Request body should contain JSON data with the following fields: name, category, ingredients, instructions.
- **PUT /api/breakfast/modify/:name**: Modify an existing breakfast recipe.
- Request body should contain JSON data with the fields to be modified.
- **DELETE /api/breakfast/delete/:name**: Delete a breakfast recipe by name.
- **GET /api/lunch**: Get all lunch recipes.
- **GET /api/lunch/:name**: Get a specific lunch recipe by name.
- **POST /api/lunch/addNewRecipe**: Add a new lunch recipe.
- **PUT /api/lunch/modify/:name**: Modify an existing lunch recipe.
- **DELETE /api/lunch/delete/:name**: Delete a lunch recipe by name.
- **GET /api/dinner**: Get all dinner recipes.
- **GET /api/dinner/:name**: Get a specific dinner recipe by name.
- **POST /api/dinner/addNewRecipe**: Add a new dinner recipe.
- **PUT /api/dinner/modify/:name**: Modify an existing dinner recipe.
- **DELETE /api/dinner/delete/:name**: Delete a dinner recipe by name.
- **GET /api/dessert**: Get all dessert recipes.
- **GET /api/dessert/:name**: Get a specific dessert recipe by name.
- **POST /api/dessert/addNewRecipe**: Add a new dessert recipe.
- **PUT /api/dessert/modify/:name**: Modify an existing dessert recipe.
- **DELETE /api/dessert/delete/:name**: Delete a dessert recipe by name.

##Undone

