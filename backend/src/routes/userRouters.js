import Router from 'express'
import { getUserDetails, logout, register, searchUsers, updateUserDetails } from '../controllers/userControllers.js';
import { checkPassword } from '../controllers/checkPassword.js';
import { checkEmail } from '../controllers/checkEmail.js';

import { isAuthorized } from '../middleware/auth.middleware.js';

const router=Router();


router.route('/register').post(register)


//login route aygo yaha......

router.route('/checkEmail').get(checkEmail)
router.route('/checkPassword').get(checkPassword)


router.route('/logout').delete(isAuthorized,logout)
router.route('/user-details').get(isAuthorized,getUserDetails)
router.route('/search-users').get(isAuthorized,searchUsers)
router.route('/update-user').post(isAuthorized,updateUserDetails)

export default router