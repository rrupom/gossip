const {
	login,
	register,
	getAllUsers,
	setAvatar,
	uploadAvatar,
	logOut,
	getuploadedavatar,
	getuserdetails,
	deleteavatar,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.get("/getuserdetails", getuserdetails);
router.post("/setavatar/:id", setAvatar);
router.post("/uploadavatar", uploadAvatar);
router.delete("/deleteavatar", deleteavatar);
router.get("/getuploadedavatar", getuploadedavatar);
router.get("/logout/:id", logOut);

module.exports = router;
