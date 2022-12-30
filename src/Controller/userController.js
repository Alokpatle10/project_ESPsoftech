const mongoose = require("mongoose")
const userModel = require("../Model/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

//===================================User Registration============================================//

const userRegistration = async function (req, res) {
    try {
        console.log(req.body);
        let { first_name, last_name, email, password, confirm_password } = req.body;

        if (!first_name || !last_name || !email || !password || !confirm_password) {
            return res.status(400).send({ status: false, message: "for user registration first_name,last_name,email,password,confirm_password all the field is required" });
        }

        if (!(/^[a-z]{2,100}$/i.test(first_name && last_name))) {
            return res.status(400).send({ status: false, msg: "first_name and last_name should contain letter only" })
        }

        if (!(/^[a-z0-9_]{3,}@[a-z]{3,}[.]{1}[a-z]{3,6}$/).test(email)) {
            return res.status(400).send({ status: false, msg: `Email is invalid` })
        }
        //==============checking duplicasy==================//
        const checkEmail = await userModel.findOne({ email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "This Email is already rugister try with another email" })
        }

        if (password !== confirm_password) {
            return res.status(400).send({ status: false, message: "password is not matched" })
        }
        //=================bcrypt password======================//
        password = await bcrypt.hash(req.body.password, 10);

        confirm_password = await bcrypt.hash(req.body.confirm_password, 10);

        const createUser = await userModel.create({ first_name, last_name, email, password, confirm_password })
        return res.status(201).send({ status: true, message: "user Created", data: createUser })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


//==================================login USER====================================//

const userLogin = async function (req, res) {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ status: false, message: "for login user email and password both are required" })
        }
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ status: false, message: "Please enter your correct emailId" });
        }
        let hpassword = await bcrypt.compare(password, user.password)
        if (hpassword == false) return res.status(400).send({ status: false, message: "Please enter your correct password" })
        //creating a jsonWebToken and sending it to responce header and body

        let token = jwt.sign({
            userId: user._id.toString()
        },
            "project_esp"
        );

        res.header("x-api-key", token);


        res.status(200).send({ status: true, message: "Usser Login Successfully", data: token })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}
//=====================================GETTING ALL THE USERS=========================================
const getAllUsers = async function (req, res) {
    try {

        const data = await userModel.find()

        if (data.length == 0) {
            return res.status(404).send({ status: false, message: "no data found " })
        }

        res.status(200).send({ status: true, data: data })


    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

//================================GET USER BY ID========================================//
const getuser = async function (req, res) {
    try {
        const userId = req.params.userId

        const data = await userModel.findById(userId)

        if (data.length == 0) {
            return res.status(404).send({ status: false, message: "no data found " })
        }

        res.status(200).send({ status: true, data: data })


    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

//=============================DELETE USER===================================================//
const deleteuserById = async function (req, res) {

    try {

        let userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ msg: `${userId} is invalid`, status: false })
        }

        let result = await userModel.findOne({ _id: userId, isDeleted: false });

        if (!result) return res.status(404).send({ status: false, msg: "user is already deleted" })

        await userModel.findByIdAndUpdate({ _id: userId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        return res.status(200).send('user is deleted');

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message });
    }

};
//======================================UPDATE USER========================================================
const updateUser = async function (req, res) {
    try {
        const userId = req.params.userId

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ msg: `${userId} is invalid`, status: false })
        }

        const editData = await userModel.findByIdAndUpdate(userId, req.body, {
            new: true
        });

        return res.status(200).send({ status: true, message: "Record updated successfully", data: editData })

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message });
    }
}




module.exports = { userRegistration, userLogin, getuser, getAllUsers, deleteuserById, updateUser }





