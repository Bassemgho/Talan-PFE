import { fetsh_all, getUserInfo ,getuser} from "../controllers/users.js";
import protectAdmin from "../middlewares/protectAdmin.js";
import express from 'express'


const router = express.Router();
router.route("/allusers").get(protectAdmin,fetsh_all);
router.route('/usermeta').get(protectAdmin,getUserInfo);
router.route('/getuser/:userId').get(protectAdmin,getuser)

export default router
