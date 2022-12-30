const express= require('express')
const router=express.Router()
const {userRegistration,userLogin,getuser, getAllUsers,deleteuserById,updateUser}=require("../Controller/userController")
const{authentication}=require("../Middleware/auth")

//=======================test-me=======================================//

router.get("/testme",(req,res)=>{
    res.status(200).send({status:true, msg:"Ok good to go"})
})
//<----------------------------------------------------------------------->//

router.post("/user",userRegistration)
router.post("/login",userLogin)
router.get("/user/:userId",authentication,getuser)
router.get("/users",authentication,getAllUsers)
router.delete("/delete/:userId",authentication,deleteuserById)
router.put("/edit/:userId",authentication,updateUser)

//<----------------------------------------------------------------------->//

module.exports=router