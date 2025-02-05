
const { isAdmin, requiredSignin } = require("../middlewares/authMiddleware.js");
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } =  require("../controllers/categoryController.js");
const  express = require('express');

const router = express.Router()

//routes
router.post('/create-category', requiredSignin, isAdmin, createCategoryController)

router.put('/update-category/:id', requiredSignin,isAdmin,updateCategoryController)

router.get("/get-category",  categoryController)

router.get("/single-category/:slug", singleCategoryController)

router.delete("/delete-category/:id", requiredSignin,isAdmin, deleteCategoryController)


module.exports = router;