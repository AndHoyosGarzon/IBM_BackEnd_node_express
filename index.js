const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

//task #7
app.use("/customer/auth/*", function auth(req, res, next) {
  try {
    const { name, password } = req.body;
    if (!name && !password) {
      return res.status(400).json({ msg: "error user or password" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, password);

    if(Date.now() > payload.expiresIn){
      return res.status(498).json({msg: 'Token expired/invalid'})
    }
    
    next();
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }

  /* if (req.session.authorization) {
    // Get the authorization object stored in the session
    const token = req.session.authorization["accessToken"]; // Retrieve the token from authorization object
    jwt.verify(token, "access", (err, user) => {
      // Use JWT to verify token
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  } */
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server is running on PORT http://localhost:${PORT}`)
);
