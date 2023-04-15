import express, {Router} from 'express';

const router = express.Router();
import { getData } from './uploadController';
router.route('/').get(getData)



export default router;