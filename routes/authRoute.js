const express = require("express");
const {registerController,loginController,testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} = require("../controllers/authController");
const { requiredSignin, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
//post signup
router.post("/register", registerController );

//post login
router.post("/login", loginController)

router.get("/test", requiredSignin, isAdmin, testController)

router.get("/user-auth", requiredSignin, (req,res)=>{
    res.status(200).send({ok:true});
});

router.get("/admin-auth", requiredSignin,isAdmin, (req,res)=>{
    res.status(200).send({ok:true});
});

router.put('/profile', requiredSignin, updateProfileController)

router.post("/forgot-password", forgotPasswordController)

router.get('/orders', requiredSignin, getOrdersController);

router.get('/all-orders', requiredSignin, isAdmin, getAllOrdersController);

router.put('/order-status/:orderId', requiredSignin, isAdmin, orderStatusController)

module.exports = router;