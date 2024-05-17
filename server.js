const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/database');
const setupRedisSession = require('./config/sessionRedis');
const passport = require('passport');
require('./config/passport');

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * if you run behind a proxy (e.g. nginx, cloudflare)
 * app.set('trust proxy', 1);
 */

/**
 * Parse request json
 */
app.use(express.json());

/**
 * Use the Redis session middleware
 */
app.use(setupRedisSession());

/**
 * Initialize Passport middleware
 */
app.use(passport.initialize());
app.use(passport.session());


/**
 *  Import load routes module
 */
const loadRoutes = require('./config/routes');

/**
 * Automatically load and bind routes
 */
loadRoutes(app);

// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})