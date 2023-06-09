import passport from "passport";
import localStrategy from "passport-local";
import githubStrategy from "passport-github2";
import { userModel } from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

export const initializePassport = ()=>{
    //estrategia para registrar el usuario
    passport.use("signupStrategy",new localStrategy(
        {
            usernameField:"email", 
            passReqToCallback:true,
        },
        async(req, username, password, done)=>{
            try {
                const userSignupForm = req.body;
                const user = await userModel.findOne({email:username});
                if(!user){
                    //si no existe el usuario, registramos el usuario
                    const newUser = {
                        first_name:userSignupForm.first_name,
                        last_name: userSignupForm.last_name,
                        age: userSignupForm.age,
                        email: userSignupForm.email,
                        password:createHash(password),
                    }
                    const userCreated = await userModel.create(newUser);
                    console.log("Datos del usuario:", userCreated);
                    return done(null, userCreated);
                } else {
                    return done(null,false);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    //estrategia de login
    passport.use("loginStrategy", new localStrategy(
        {
            usernameField:"email",
            passReqToCallback:true,
        },
        async(req, username, password, done)=>{
            try {
                //buscamos el usuario en la base de datos por el correo
                const userDB = await userModel.findOne({email:username});
                if(userDB){
                    //si existe el usuario, verificamos la contraseña del usuario
                    if(isValidPassword(password,userDB)){
                        if (userDB.email === "adminCoder@coder.com") {
                            // Si el usuario tiene credenciales de administrador
                            req.user = {
                                first_name: userDB.first_name,
                                last_name: userDB.last_name,
                                email: userDB.email,
                                role: "admin"
                            };
                        } else {
                            // Usuario no administrador
                            req.user = {
                                first_name: userDB.first_name,
                                last_name: userDB.last_name,
                                email: userDB.email,
                                role: "usuario"
                            };
                        }
                        console.log("Datos usuario identificado:",req.user );
                        return done(null,userDB);
                    } else {
                        return done(null, false)
                    }
                } else {
                    return done(null,false)
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    //estrategia de registro Github
    passport.use("githubSignup", new githubStrategy(
        {
            clientID:"Iv1.f225a334045fc06d",
            clientSecret:"a7eea0537f86c0b617310b207a0b8ede8bedc7aa",
            callbackUrl:"http://localhost:8080/api/sessions/github-callback"
        },
        async(accesstoken,refreshtoken,profile,done)=>{
            try {
                console.log("profile", profile);
                const user = await userModel.findOne({email:profile.username});
                if(!user){
                    //si no existe el usuario, registramos el usuario
                    const newUser = {
                        first_name:profile.username,
                        last_name: "",
                        age: null,
                        email: profile.username,
                        password:createHash(profile.id),
                    }
                    const userCreated = await userModel.create(newUser);
                    return done(null, userCreated);
                } else {
                    //          error, user
                    return done(null,false);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    //serialización y deserialización
    passport.serializeUser((user,done)=>{
        done(null,user._id); ///req.session = _id usuario
    });

    passport.deserializeUser(async(id,done)=>{
        const userDB = await userModel.findById(id);
        done(null,userDB); //req.user = userDB
    });
}