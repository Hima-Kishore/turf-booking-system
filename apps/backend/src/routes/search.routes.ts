import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';

const router = Router();
const searchController = new SearchController();

router.get('/turfs', searchController.searchTurfs);
router.get('/cities', searchController.getCities);

export default router;