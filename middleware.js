import jwt from 'jsonwebtoken';

export const auth = (req, res, next) =>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) return res.status(403).json({message: "Token expired!"});
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
            if(err) return res.status(403).json({message: "Token expired!!"});

            req.user = user;
            next()
        });


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}