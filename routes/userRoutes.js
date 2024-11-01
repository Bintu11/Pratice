const Router=require ("express");

const{
    registration,
    login,
    profileData

}=require("../controllers/usercontroller");

const router=Router();

   
router.post("/registration",registration);
router.get("/login",login);
router.get("/profile",profileData);

module.exports = router;