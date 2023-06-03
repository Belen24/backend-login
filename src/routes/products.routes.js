import {Router} from "express";
import { ProductsMongo } from "../managers/products.mongo.js";

const productsService = new ProductsMongo();

const router = Router();

//products routes
//ruta para mostrar lista de productos
router.get("/", async (req, res) => {
    try {
        const products = await productsService.getProducts();
        const limit = parseInt (req.query.limit);
        if (!isNaN (limit)){
            res.send(products.slice(0, limit));
        } else {
            res.json({status:"success", data:products});
        }
    } catch (error) {
        res.json({status:"error", message:error.message});
    }
  });

//ruta para buscar un producto por medio de su ID
router.get("/:pid",async(req,res)=>{
    try {
        const productId = await productsService.getProductById(req.params.pid);
        res.json({status:"success",data:productId});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});

//ruta para crear un producto
router.post("/",async(req,res)=>{
    try {
        const productCreated = await productsService.createProduct(req.body);
        res.json({status:"success",data:productCreated});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});

//ruta para actualizar un producto
router.put("/:id",async(req,res)=>{
    try {
        //const {price}= req.body;
        const modProduct = await productsService.updateProduct(req.params.id , req.body);
        res.json({status:"success",data:modProduct});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});

//ruta para eliminar un producto
router.delete("/:id",async(req,res)=>{
    try {
        const result = await productsService.deleteProduct(req.params.id);
        res.json({status:"success",data:result.message});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({status:"error", message:error.message});
    }
});

export {router as productsRouter}
