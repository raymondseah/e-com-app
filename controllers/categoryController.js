const CategoryModel = require('../models/categoryModel')
const ProductModel = require('../models/productModel')

const categoryControllers = {
    getCategories: async(req, res) =>{
        try {
            const categories = await CategoryModel.find()
            res.json(categories)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createCategory: async (req, res) =>{
        console.log(req.body.name)
        try {
            // if user have role = 1 ---> admin
            // only admin can create , delete and update category
            const {name} = req.body.name;
            const category = await CategoryModel.findOne({name})
            if(category) return res.status(400).json({msg: "This category already exists."})

            const newCategory = new CategoryModel({name})

            await newCategory.save()
            res.json({msg: "Created a category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategory: async(req, res) =>{
        try {
            const products = await ProductModel.findOne({category: req.params.id})
            if(products) return res.status(400).json({
                msg: "Please delete all products with a relationship."
            })

            await CategoryModel.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCategory: async(req, res) =>{
        console.log(req.body.name)
        console.log(req.params.id)
        try {
            const {name} = req.body;
            console.log({name})
            await CategoryModel.findOneAndUpdate({_id: req.params.id}, {name})

            res.json({msg: "Updated a category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}


module.exports = categoryControllers