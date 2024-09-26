import jwt from 'jsonwebtoken'
const JWT_KEY = process.env.JWT_KEY

export const jwtAuth = async(req,res,next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    const DerivedToken = token.split(' ')[1];
    if (!DerivedToken) {
        return res.status(401).json({ error: "Unable to derive provided" });
    }

    // veryfying token 
    try{
        const decodedToken = jwt.verify(DerivedToken,JWT_KEY);
        if(decodedToken){
            if(decodedToken.role === "admin"){
                req.admin = decodedToken;
            }else if(decodedToken.role === "user"){
                req.user = decodedToken
            }else{
                return res.status(403).json({ message: "Invalid role in token" });
            }
        }else{
            return res.status(401).json({error : "unable to validate token"})
        }
        next();
    }catch(err){
        return res.status(403).json({
            message : "invalid or expired token",
            error : err.message
        })
    }
}