import Users from "../models/user.js";
import { createRefreshToken, isMatch, validateEmail, validatePassword } from "../utils/helpers.js";
import bcrypt from "bcrypt";
import { userSendMail } from "../utils/sendMail.js";
import jwt from 'jsonwebtoken';
const { DEFAULT_CLIENT_URL } = process.env

export const signUp = async (req, res) =>{
    try {
        const {personal_id, name, email, password, confirmPassword, address, phone_number} = req.body;

        if(!personal_id || !name || !email || !password || !confirmPassword){
            return res.status(400).json({message: "Please fill in all field"});
        }
        if(name.length < 3) return res.status(400).json({message: "Your name must be at least 3 letters long"})

        if(!validateEmail(email)){
            return res.status(400).json({
                message: "Invalid emails"
            });
        }
        if(!validatePassword(password)){
            return res.status(400).json({
                message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
            });
        }
        if(!isMatch(password, confirmPassword)) return res.status(400).json({message: 'Password did not match!'});


        const existingUser = await Users.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "This email is already registerd"});
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            personal_id,
            name,
            email,
            password: hashedPassword,
            address,
            phone_number
        });

        await newUser.save();

        // Create email notificatin for user
        const refreshToken = createRefreshToken(newUser);
        const url = `${DEFAULT_CLIENT_URL}/user/activate/${refreshToken}`;
        userSendMail(email, url, "Verify your email address", "Confirm Email")

        res.status(200).json({
            message: "User registered successfully, Please active your email"});



        } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// User Sign In
export const signIn = async (req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await Users.findOne({email});
        if(!email || !password) return res.status(400).json({message: "Please fill the all field!"});
        if(!user) return res.status(400).json({message: "Invalid Credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});
        const refresh_token = createRefreshToken({id: user._id});
        const expiry = 24 * 60 * 60 * 1000 // 1 day
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/user/refresh_token',
            maxAge: expiry,
            expires: new Date(Date.now() + expiry)
        });
        res.json({
            message: "Sign In Successfully!",
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//User info
export const userInformation = async (req, res) =>{
    try {
        const userId = req.user.id;
        const userInfo = await Users.findById(userId).select("-password");

        res.json(userInfo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Activate Email
export const activateEmail = async (req, res) =>{
    try {
        const {activation_token} = req.body;
        const user = jwt.verify(activation_token, process.env.REFRESH_TOKEN_SECRET);
        const {personal_id, name, email, password, address, phone_number} = user;

        const existingUser = await Users.findOne({email});
        
        if (existingUser) {
            return res.status(400).json({ message: "This email already exists." });
        }

        const newUser = new Users({
            personal_id,
            name,
            email,
            password,
            address,
            phone_number
        })

        await newUser.save()

        res.json({ message: "Account has been activated. Please login now!" });
    } catch (error) {
         return res.status(500).json({ message: error.message });
    }
}