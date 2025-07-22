import Users from "../models/user.js";
import { isMatch, validateEmail, validatePassword } from "../utils/helpers.js";
import bcrypt from "bcrypt";

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

        res.status(200).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

        } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}