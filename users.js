const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

// Initialize body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve HTML form
app.get('/form', function(req, res) {
    res.sendFile(__dirname + "/form.html");
});

// Get all users
app.get('/listUsers', function(req, res) {
    fs.readFile(__dirname + "/user.json", 'utf8', function(err, data) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }
        res.send(data);
    });
});

// Get user by ID
app.get('/user/:id', function(req, res) {
    fs.readFile(__dirname + "/user.json", 'utf8', function(err, data) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }
        var users = JSON.parse(data);
        var user = users['user' + req.params.id];
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    });
});

// Delete user by ID
app.delete('/deleteUser/:id', function(req, res) {
    fs.readFile(__dirname + "/user.json", 'utf8', function(err, data) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }
        var users = JSON.parse(data);
        if (users['user' + req.params.id]) {
            delete users['user' + req.params.id];
            fs.writeFile(__dirname + "/user.json", JSON.stringify(users), function(err) {
                if (err) {
                    console.error("Error writing file:", err);
                    return res.status(500).send("Error writing file");
                }
                res.send(users);
            });
        } else {
            res.status(404).send("User not found");
        }
    });
});

// Add a new user
app.post('/addUser', function(req, res) {
    fs.readFile(__dirname + "/user.json", 'utf8', function(err, data) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }
        var users = JSON.parse(data);
        var newUser = {
            name: req.body.name,
            password: req.body.password,
            profession: req.body.profession
        };
        users['user' + Object.keys(users).length] = newUser;
        fs.writeFile(__dirname + "/user.json", JSON.stringify(users), function(err) {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send("Error writing file");
            }
            res.send(users);
        });
    });
});

// Start the server
const port = 9000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
