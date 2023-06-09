import { Router } from "express";
import { userModel } from "../models/users.model.js";
import { createHash , isValidPassword} from "../utils.js";
import passport from "passport";

const router = Router();

// Ruta para registrar al usuario
router.post("/signup", passport.authenticate("signupStrategy",{
    failureRedirect:"/api/sessions/signup-failed"
}) , (req,res)=>{
    //proceso exitoso de registro
    res.send('<div>usuario registrado, <a href="/login">ir al login</a></div>');
});

router.get("/signup-failed",(req,res)=>{
    res.send('<div>Hubo un error al registrar el usuario, <a href="/signup">intente de nuevo</a></div>');
});

//Ruta para loguear al usuario
router.post("/login", passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/login-failed"
}) , (req,res)=>{
    //proceso exitoso de login
    res.redirect("/products");
});

router.get("/login-failed",(req,res)=>{
    res.send('<div>Hubo un error al loguear el usuario, <a href="/login">intente de nuevo</a></div>')
});

//ruta para iniciar con GitHub
router.get("/github",passport.authenticate("githubSignup"));

router.get("/github-callback",
    passport.authenticate("githubSignup",{
        failureRedirect:"/api/sessions/signup-failed"
    }),
    (req,res)=>{
        res.redirect("/products");
    }
);

//ruta cerrar sesion
router.get("/logout",(req,res)=>{
    //req.logout elimila la propiedad req.user y limpia la session actual
    req.logOut(error=>{
        if(error){
            return res.send('no se pudo cerrar sesion, <a href="/profile">ir al perfil</a>');
        } else {
            //req.session.destroy elimina la sesion de la base de datos
            req.session.destroy(err=>{
                if(err) return res.send('no se pudo cerrar sesion, <a href="/profile">ir al perfil</a>');
                res.redirect("/")
            });
        }
    })
});



export {router as authRouter};
