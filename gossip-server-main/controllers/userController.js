const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user)
			return res.json({ msg: "Incorrect Username or Password", status: false });
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid)
			return res.json({ msg: "Incorrect Username or Password", status: false });
		delete user.password;
		return res.json({ status: true, user });
	} catch (ex) {
		next(ex);
	}
};

module.exports.register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;
		const usernameCheck = await User.findOne({ username });
		if (usernameCheck)
			return res.json({ msg: "Username already used", status: false });
		const emailCheck = await User.findOne({ email });
		if (emailCheck)
			return res.json({ msg: "Email already used", status: false });
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			email,
			username,
			password: hashedPassword,
		});
		delete user.password;
		return res.json({ status: true, user });
	} catch (ex) {
		next(ex);
	}
};

module.exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find({ _id: { $ne: req.params.id } }).select([
			"email",
			"username",
			"avatarImage",
			"_id",
		]);
		return res.json(users);
	} catch (ex) {
		next(ex);
	}
};

module.exports.getuserdetails = async (req, res, next) => {
	try {
		const user = await User.findById(req.query.userId);
		return res.json(user);
	} catch (ex) {
		next(ex);
	}
};

module.exports.setAvatar = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const avatarImage = req.body.image;
		const userData = await User.findByIdAndUpdate(
			userId,
			{
				isAvatarImageSet: true,
				avatarImage,
			},
			{ new: true }
		);
		return res.json({
			isSet: userData.isAvatarImageSet,
			image: userData.avatarImage,
		});
	} catch (ex) {
		next(ex);
	}
};

module.exports.uploadAvatar = async (req, res, next) => {
	try {
		const { image, userId } = req.body;
		const userData = await User.findById(userId);
		userData.uploadedImages.push(image);
		const result = await userData.save();

		return res.json(result);
	} catch (error) {
		next(error);
	}
};

module.exports.getuploadedavatar = async (req, res, next) => {
	try {
		const { userId } = req.query;
		const userData = await User.findById(userId);

		return res.json(userData?.uploadedImages);
	} catch (error) {
		next(error);
	}
};

module.exports.deleteavatar = async (req, res, next) => {
	try {
		const { userId, imgId } = req.body;
		const userData = await User.findById(userId);

		const images = userData?.uploadedImages?.filter((v) => v !== imgId);
		userData.uploadedImages = images;

		await userData.save();

		res.json({ message: "Deleted successfully" });
	} catch (error) {
		next(error);
	}
};

module.exports.logOut = (req, res, next) => {
	try {
		if (!req.params.id) return res.json({ msg: "User id is required " });
		onlineUsers.delete(req.params.id);
		return res.status(200).send();
	} catch (ex) {
		next(ex);
	}
};
