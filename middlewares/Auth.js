import jwt from 'jsonwebtoken'
const JWT_KEY = process.env.JWT_KEY
const ErrorTypes = {
    nullToken : "No token provided/can't find token",
    wrongFormat : "Wrong format for token provided , it must be *'Bearer <Token>'*",
    invalidToken : "Token is expired or invalid",
    noRole : "No role or invalid role assigned to token",
    verificationError : "token verification failed",
    missingKey : "Jwt key not provided "
};
export const jwtAuth = async(req,res,next) => {
    if(!JWT_KEY){
        return res.status(500).json({ error : ErrorTypes.missingKey });
    }
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error:  ErrorTypes.nullToken});
    }
    const tokenPair = token.split(' ');
    if(tokenPair.length !== 2 || tokenPair[0] !== 'Bearer'){
        return res.status(401).json({ error: ErrorTypes.wrongFormat });
    }
    const DerivedToken = tokenPair[1]; // extract token from bearer

    // veryfying token 
    try{
        const decodedToken = jwt.verify(DerivedToken,JWT_KEY);
        if(decodedToken){
            if(decodedToken.role === "admin"){
                req.admin = decodedToken;
            }else if(decodedToken.role === "user"){
                req.user = decodedToken
            }else{
                return res.status(403).json({ error : ErrorTypes.noRole });
            }
        }else{
            return res.status(403).json({error : ErrorTypes.invalidToken})
        }
        next();
    }catch(err){
        return res.status(403).json({
            message : ErrorTypes.verificationError,
            error : err.message
        })
    }
}