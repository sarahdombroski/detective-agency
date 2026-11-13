import { Router } from 'express';
import { homePage } from './index.js';
import authRoutes from './auth.js';
import { processLogout, showDashboard } from './auth.js';
import { requireLogin } from '../middleware/auth.js';

// Create a new router instance
const router = Router();

// Add catalog-specific styles to all catalog routes
// router.use('/catalog', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
//     next();
// });

// Home and basic pages
router.get('/', homePage);
// router.get('/cases', casePage);
// router.get('/investigations', investigationsPage)

// Auth routes
router.use('/register', authRoutes);
router.use('/login', authRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);

export default router;