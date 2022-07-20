require('dotenv').config()
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 4001;

const people = [{ id: 1, first_name: "Modestine", last_name: "Jorin" },{ id: 2, first_name: "Darin", last_name: "De Blase" },{ id: 3, first_name: "Gnni", last_name: "Dael" },];

function sayHello(req, res, next){
  next();
}

function generateToken(user) {
  return jwt.sign(user, "tacos");
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  //store token in variable
  const token = authHeader && authHeader.split(" ")[1];
  
  //what if no token exists
  if(!token) return res.sendStatus(401);

  jwt.verify(token, "tacos", (err, user) => {
    if(err) return res.sendStatus(403);

    req.user = user;

    next();
  })
}

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello & welcome to our server!')
})

app.get('/people', authenticateToken, (req, res) => {
  res.json(people);
})

app.post("/signup", async (req, res) => {
  const { name, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  people.push({ id: "5", name, password: hashedPassword });
  res.json(people);
});

app.post('/signin', async (req, res) => {
  const { name, password } = req.body;

  const user = people.find((user) => user.name === name);

  console.log(user);

  const match = await bcrypt.compare(password, user.password);
  console.log(match)

  if(match){
    const token = generateToken(user);
    res.json(token);
  } else {
    res.sendStatus(403);
  }
})

app.listen(port, () => {
 console.log(`Web server is listening on port ${port}!`);
});


