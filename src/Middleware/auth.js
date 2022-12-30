const jwt = require("jsonwebtoken");
    const authentication = async function(req,res,next){

        const token = req.headers["x-api-key"];
        
        if(!token){ return res.status(400).send({msg:"please provide token"}) }
    
        try{
            const decodedToken = jwt.verify(token, "project_esp");
    
            if(!decodedToken)
            return res.status(401).send({status:false, msg:"invalid token"});
    
            req.decodedToken = decodedToken;
    
            next();
        }catch(error) {  res.status(500).send({error: error.message})}
    
    };
module.exports={authentication}