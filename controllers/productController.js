const productModel = require("../models/productModel");
const slugify = require('slugify');
const { Client } = require('square/legacy');
const fs = require('fs');
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel")
const dotenv = require('dotenv')

dotenv.config();

const accessToken = process.env.SANDBOX_ACC_TOKEN;

const client = new Client({
    accessToken: accessToken,  // Square's access token from your environment variables
    environment: 'sandbox',  // 'sandbox' or 'production'
  });
  


const createProductController = async(req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        switch(true){
            case !name:
                return res.status(500).send({error: "Name is required!"})
            case !description:
                return res.status(500).send({error: "Description is required!"})
            case !price:
                return res.status(500).send({error: "Price is required!"})
            case !category:
                return res.status(500).send({error: "Category is required!"})
            case !quantity:
                return res.status(500).send({error: "Quantity is required!"})
            case photo && photo.size > 1000000:
                return res.status(500).send({error: "Photo is required and should be less than 1 mb"})
        }

        const products = new productModel({...req.fields, slug:slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(200).send({
            success:true,
            message: "Products created",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error in creating Prouct",
            error
        })
    }
}

const getProductsController = async(req,res)=>{
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt: -1});
        res.status(200).send({
            success:true,
            countTotal: products.length,
            message: "GetProducts",
            products,
           
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error in getting Products",
            error
        })
    }
}

const getSingleProductController = async(req,res)=>{
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
        res.status(200).send({
            success:true,
            message:"Fetched product",
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: "Error in getting single Product",
            error
        })
    }
}

const relatedProductController = async(req,res)=>{
    try {
        const {pid,cid} = req.params;
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid},
        }).select('-photo').limit(3).populate('category');

        res.status(200).send({
            success:true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message: "Error in getting related products",
            error
        })
    }
}

const productPhotoController = async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error in getting photos",
            error
        })
    }
}

const deleteProductController = async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            message:"Product Deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in deleting product",
            error
        })
    }
};


const updateProductController = async(req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        switch(true){
            case !name:
                return res.status(500).send({error: "Name is required!"})
            case !description:
                return res.status(500).send({error: "Description is required!"})
            case !price:
                return res.status(500).send({error: "Price is required!"})
            case !category:
                return res.status(500).send({error: "Category is required!"})
            case !quantity:
                return res.status(500).send({error: "Quantity is required!"})
            case photo && photo.size > 10000:
                return res.status(500).send({error: "Photo is required and should be less than 1 mb"})
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug:slugify(name)}, {new:true})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(200).send({
            success:true,
            message: "Products Updated",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:true,
            message:"Error in updating",
            error
        })
    }
}

const productFiltersController = async(req,res)=>{
    try {
        const {checked,radio}= req.body;
        let args = {}
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message: "Error While filtering",
            error
        })
    }
}

const productCountController = async(req,res)=>{
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: true,
            message: "Error in product count",
            error
        })
    }
}

const productListController = async(req,res)=>{
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select('-photo').skip((page -1) * perPage).limit(perPage).sort({createdAt: -1});
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while getting Page",
            error
        })
    }
}

const searchProductController = async(req,res)=>{
    try {
        const {keyword} = req.params;
        const results = await productModel.find({
            $or:[
                {name:{$regex :keyword, $options: 'i' }},
                {description:{$regex :keyword, $options: 'i' }},
            ]
        }).select('-photo');
        res.json(results)
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in searching product",
            error
        })
    }
}

const productCategoryController = async(req,res)=>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        const products = await productModel.find({category}).populate('category');
        res.status(200).send({
            success:true,
            products,
            category
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message: "Error in getting product Category",
            error
        })
    }
}

// squareTokenController
 const squareTokenController = async (req, res) => {
    try {
        const { cardNumber, cvv, expirationDate, postalCode } = req.body;

        // You'd normally use Square’s `Card` tokenization service here.
        // For simplicity, this is a simplified mock of token generation.
      
        // Here we would use Square’s API to create a card nonce using the card info,
        // however, since you're using a custom form, it’s important to use Square's 
        // secure method to tokenize card details client-side.
      
        // In a real implementation, you should use Square’s Web SDK or other methods 
        // to securely generate the nonce client-side (NOT server-side).
      
        // **Important Note:** Never send or store sensitive card details (like card number or CVV) directly in your backend.
      
        // Mock response for nonce generation
        res.json({ nonce: 'cnon:card-nonce-ok' });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  // squarePaymentController
  const squarePaymentController = async (req, res) => {
    const { nonce, cart } = req.body;
    console.log(nonce);
    console.log(cart);

    let totalAmount = 0;
    cart.forEach((item) => {
        totalAmount += item.price; // Assuming price is in dollars
    });
    console.log('working')

    const paymentsApi = client.paymentsApi;
    console.log(paymentsApi);

    // Convert totalAmount to cents and avoid using BigInt (use a number)
    const totalAmountInCents = Math.round(totalAmount * 100); // Convert to integer cents

    const requestBody = {
        idempotencyKey: generateIdempotencyKey(),
        sourceId: nonce,
        amountMoney: {
            amount: totalAmountInCents, // Use integer cents (no BigInt)
            currency: 'USD',
        },
    };

    console.log(requestBody);
    console.log(req.user._id);

    try {
        const response = await paymentsApi.createPayment(requestBody);

        if (response.result) {
            // Here, ensure that any BigInt values are converted to strings.
            const paymentData = response.result.payment;
            // Convert BigInt values in the response (if any) to strings
            const sanitizedPaymentData = {
                ...paymentData,
                id: paymentData.id.toString(),  // Convert any BigInt to string
                amountMoney: {
                    amount: paymentData.amountMoney.amount.toString(), // Convert BigInt to string
                    currency: paymentData.amountMoney.currency
                }
            };

            // Save order to database (use your own order model)
            const order = new orderModel({
                buyer: req.user._id,
                products: cart,
                payment: sanitizedPaymentData,
            });

            await order.save();
            res.json({ ok: true });
        } else {
            res.status(500).json({ error: 'Payment failed' });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Helper function for idempotency key (optional)
function generateIdempotencyKey() {
    return Math.random().toString(36).substring(7); // Unique key for each request
}

  
  


module.exports = {createProductController,
                 productFiltersController,
                 squareTokenController,
                 getProductsController,
                 squarePaymentController,
                 deleteProductController,
                 updateProductController,
                 productListController,
                 getSingleProductController,
                 productPhotoController,
                 productCountController,
                 relatedProductController,
                 productCategoryController,
                 searchProductController}