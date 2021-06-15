const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyTokenAdmin = require('./verifyTokenAdmin');
const Admin = require('../model/admin');

router.get("/" , async (req , res) =>
{
    let  details = await Admin.find({});
    res.send(details); 
})
router.get("/enable" , async (req , res) =>
{
    let  details = await Admin.find({});
    res.send(details); 
})

router.put("/status/:id", async (req, res) => {

    const adminId = req.params.id;
    const bookingStatus = req.body;
    await Admin.findByIdAndUpdate(adminId, {$set:{enableBooking:bookingStatus.status}}, { useFindAndModify: false });
    res.send("changed");
});

router.post("/", async (req, res) => {
    let reqAdminDetails = req.body;
    console.log(reqAdminDetails);
    let postAdmin= Admin ({
        userName:reqAdminDetails.userName,
        pwd:reqAdminDetails.pwd,
        enableBooking:"true"
    });
    let saved = await postAdmin.save();
    res.send(saved);
})

module.exports = router;
