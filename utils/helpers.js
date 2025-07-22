import jwt from "jsonwebtoken";

export function createRefreshToken(payload){
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
}

export function isMatch(password, confirmPassword){
    if(password === confirmPassword) return true;
    return false
}

export function validateEmail(email){
    const re =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
    return re.test(email);
}

// validate password
export function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    return re.test(password)
}

