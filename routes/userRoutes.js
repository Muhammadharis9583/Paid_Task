const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  getMyAccount,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser,
  markAttendance,
  getMonthlyAttendance,
} = require('../controllers/userController');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');

router.use((req, res, next) => {
  res.header({ 'Access-Control-Allow-Origin': '*' });
  next();
});
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// only access these routes after logging in because of protect middleware
router.use(protect);
router.get('/logout', logout);
router.get('/me', getMyAccount, getUserById);
router.patch('/updateMe', updateMe);
router.patch('/updatePassword', updatePassword);
router.delete('/deleteMe', deleteMe);
router.patch('/markAttendance', restrictTo('user'), markAttendance);
router.get('/monthlyAttendance/:year', getMonthlyAttendance);

// restrict the routes below to admin roles
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
