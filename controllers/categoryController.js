const categoryModel = require("../models/categoryModel.js");
const slugify = require("slugify");

 const createCategoryController = async(req,res)=>{
    try {
        const {name}= req.body;
        if(!name){
            return res.status(401),send({message: 'Name is required'})
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: "Category Already Exists"
            })
        };
        const category = await new categoryModel({name, slug:slugify(name)}).save()
        res.status(200).send({
            success: true,
            message: "New category created",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message: "Error in Category"
        })
    }
}


const updateCategoryController = async(req,res)=>{
    try {
        const {name}= req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new:true});
        res.status(200).send({
            success:true,
            message: "Category Updated successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating category",
            error
        })
    }
}


const categoryController = async(req,res)=>{
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All categories list",
            categories
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            message: "Error in getting categories",
            error
        })
    }
};


const singleCategoryController = async(req,res)=>{
    try {
        const {slug} = req.params;
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success: true,
            message: "Get single category successfull",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Erorr while getting category",
            error
        })
    }
};

const deleteCategoryController = async(req,res)=>{
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: "Error in deleting",
            error
        })
    }
}

module.exports = {createCategoryController, updateCategoryController, categoryController, deleteCategoryController, singleCategoryController}