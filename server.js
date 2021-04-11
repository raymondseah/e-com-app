require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const methodOverride = require("method-override");
const app = express();
const port = process.env.PORT;

const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

///////////////////////
//     middleware    //
///////////////////////
const auth = require("./middleware/auth");
const authAdmin = require("./middleware/authAdmin");

///////////////////////
//     mongoose      //
///////////////////////
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
mongoose.set("useFindAndModify", false);

app.use(methodOverride("_method"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: "*",
  })
);
app.options("*", cors());

app.use(fileUpload({
  useTempFiles: true
}))

app.use(cookieParser())
///////////////////////
//     controller    //
///////////////////////
const userControllers = require("./controllers/userController");
const productControllers = require("./controllers/productController");
const imageControllers = require("./controllers/imageController");
const categoryControllers = require("./controllers/categoryController");

///////////////////////
//     routes        //
///////////////////////
// Test Connection
app.get("/api/v1", (req, res) => {
  res.json({
    message: "Server is Running",
  });
});

///////////////////////
// USER Controller/////
///////////////////////
// user registration
app.post("/api/v1/users/register", userControllers.register);
// user login route
app.post("/api/v1/users/login", userControllers.login);
// user logout
app.post("/api/v1/users/login", userControllers.logout);
// refresh token
app.post("/api/v1/users/refresh_token", userControllers.refreshToken);

///////////////////////
// product Controller//
///////////////////////
// product creation
app.post("/api/v1/products/create", productControllers.createProduct);
// product get
app.get("/api/v1/products", productControllers.getAllProducts);
// product get by id
app.get("/api/v1/products/:id", productControllers.getProductById);
// product delete
app.delete("/api/v1/products/delete/:id",productControllers.deleteProductById)
// update product
app.put("/api/v1/products/update/:id", productControllers.updateProductById)

///////////////////////
// image Controller////
///////////////////////
// image upload
app.post("/api/v1/images/upload",imageControllers.uploadImage);
// image delete
app.post("/api/v1/images/delete",imageControllers.deleteImage);

///////////////////////
// category Controller/
///////////////////////
// create category
app.post("/api/v1/category",categoryControllers.createCategory);
// get all category
app.get("/api/v1/category",categoryControllers.getCategories);
// delete category
app.delete("/api/v1/category/:id",categoryControllers.deleteCategory);
// edit category
app.put("/api/v1/category/:id",categoryControllers.updateCategory);

///////////////////////
//     listener      //
///////////////////////
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    // DB connected successfully
    console.log("DB connection successful");

    app.listen(process.env.PORT || port, () => {
      console.log(`e-com app listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
