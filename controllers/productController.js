const ProductModel = require("./../models/productModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productControllers = {
  createProduct: async (req, res) => {
    ProductModel.findOne({
      product_id: req.body.product.product_id,
    })
      .then((checkProductResult) => {
        if (checkProductResult) {
          res.status(400);
          res.json({
            msg: "Already have product id",
          });
          return;
        }
        ProductModel.create({
          product_id: req.body.product.product_id,
          title: req.body.product.title,
          price: req.body.product.price,
          description: req.body.product.description,
          content: req.body.product.content,
          images: req.body.images,
          category: req.body.product.category,
        })
          .then((createProductResult) => {
            res.status(200);
            res.json({
              msg: "Product created successfully",
            });
          })
          .catch((err) => {
            res.statueCode = 409;
            res.json({
              msg: "unable to create due to unexpected error",
            });
          });
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          msg: "fail to create",
        });
      });
  },

  getAllProducts: async (req, res) => {
    try {
      const features = new APIfeatures(ProductModel.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProductById: async (req, res) => {
    ProductModel.findOne({
      _id: req.params.id,
    })
      .then((result) => {
        ProductModel.deleteOne({
          _id: req.params.id,
        })
          .then((deleteResult) => {
            res.status(400);
            res.json({
              msg: "Deleted Item",
            });
          })
          .catch((err) => {
            res.statueCode = 409;
            res.json({
              msg: "unable to delete due to unexpected error",
            });
          });
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  },
  updateProductById: async (req, res) => {
    ProductModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.product.title,
        price: req.body.product.price,
        description: req.body.product.description,
        content: req.body.product.content,
        images: req.body.images,
        category: req.body.product.category,
      }
    )
      .then((result) => {
        res.json({ msg: result });
      })
      .catch((err) => {
        res.json(err);
      });
  },
  getProductById: async (req, res) => {
    ProductModel.findOne({
      _id: req.params.id,
    })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.statueCode = 409;
        res.json({
          msg: "unable to find due to unexpected error",
        });
      });
  },
};

module.exports = productControllers;
