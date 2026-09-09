# Shopping List App

A React and TypeScript shopping list app for creating lists, managing items, filtering by category, searching, editing, deleting, and sharing a list.

## Run locally

Install packages:


a npm install

Start the JSON Server database in one terminal:


npm run server

Start the frontend in another terminal:


npm run dev

The frontend uses http://localhost:3000 by default. To use another API, create a .env file with:


VITE_API_URL=http://localhost:3000

## If db.json is deleted

Restore the empty database shape with:


cp db.example.json db.json

Then start JSON Server again and register a new account through the app. Registered users and shopping lists are saved in db.json by json-server.

## Main flow

1. Landing page
2. Continue to registration
3. Log in with email and password
4. Home page with the user’s lists
5. Open a list to add, edit, check, delete, search, filter, sort, and share items

## Important training note

json-server is a local training backend. It stores passwords in db.json as plain text. A real backend should hash passwords on the server and should never expose password values to the browser after login.
