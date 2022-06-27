import {addUser,changepassword,forgot_password,signin, verifyresettoken,getuser,deleteuser,verifyActivationtoken,changePasswordActivation} from "../controllers/auth.js"
import { add_roles } from "../controllers/roles.js";
import protectAdmin from '../middlewares/protectAdmin.js'
import protect from '../middlewares/protect.js'
import express from "express"

const router = express.Router();


router.post("/auth/signin",signin);
router.route("/auth/user").get(protect,getuser);
router.route('/auth/deleteuser').post(protectAdmin,deleteuser)
router.route("/auth/adduser").post(protectAdmin,addUser);
router.route("/auth/forgotpassword").post(forgot_password)
router.route("/auth/changepassword").post(protect,changepassword)
router.route("/auth/resetpassword/:token").get(verifyresettoken)
router.route("/auth/activate/:token").get(verifyActivationtoken)
router.route('/auth/activate/changepassword').post(protect,changePasswordActivation)
// router.post('/addroles',add_roles)

export default router
