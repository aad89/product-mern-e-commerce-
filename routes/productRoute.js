const express = require("express");
const { requiredSignin, isAdmin } = require("../middlewares/authMiddleware");
const formidable = require("express-formidable");
const { createProductController, getProductsController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController, squareTokenController, squarePaymentController } = require("../controllers/productController");

const router = express.Router();

//create

router.post("/create-product", requiredSignin, isAdmin,formidable(), createProductController);


router.get("/get-products", getProductsController)


router.get("/get-products/:slug", getSingleProductController)

router.get("/product-photo/:pid", productPhotoController)

router.delete("/delete-product/:pid", deleteProductController);

router.put("/update-product/:pid", requiredSignin, isAdmin,formidable(), updateProductController);

router.post("/product-filter", productFiltersController);

router.get('/product-count', productCountController)

router.get('/product-list/:page', productListController)

router.get('/search/:keyword', searchProductController)

router.get('/related-product/:pid/:cid', relatedProductController);

router.get('/product-category/:slug', productCategoryController);

// payments routes

// token
router.post("/square/token", squareTokenController);

// payments
router.post("/square/payment",requiredSignin,  squarePaymentController);



module.exports = router;