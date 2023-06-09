import { Router } from "express";
import { productsModel } from "../models/products.model.js";

const router = Router();


//rutas de las vistas
router.get("/", (req,res)=>{
    res.render("home");
});

router.get("/login", (req,res)=>{
    res.render("login");
});

router.get("/signup", (req,res)=>{
    res.render("registro");
});

router.get("/profile", (req,res)=>{
    console.log(req.session.user)
    res.render("perfil");
    //res.render ("perfil");
});

router.get("/products", async (req, res) => {
    try {
      console.log(req.session.user);
      const products = await productsModel.find().lean();
      res.render("products", { email: req.user.email, products: products });
    } catch (error) {
      console.log(error);
      res.send("Hubo un error al cargar los productos");
    }
  });


export { router as viewsRouter};
