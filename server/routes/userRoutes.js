import express from "express";
import { authUser, registerUser, logoutUser } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.get('/logout', logoutUser);

router.get('/checkAuth', protect, (req, res) => {
    // req.user is set by 'protect' middleware
    res.status(200).json({ 
        _id: req.user._id, 
        email: req.user.email,
        message: 'User authenticated'
    });
});

export default router;