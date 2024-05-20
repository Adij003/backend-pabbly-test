const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/database');
// const setupRedisSession = require('./config/sessionRedis');
const setupMongoSession = require('./config/sessionMongo');
const corsMiddleware = require('./config/cors');
const helmetMiddleware = require('./config/helmet');
const cacheControl = require('./config/cacheControl');
const passport = require('passport');
require('./config/passport');
const cookieParser = require('cookie-parser');
const compression = require('compression');

/**
 * Use the custom CORS middleware
 */
app.use(corsMiddleware);

/**
 * Use the custom Helmet middleware
 */
app.use(helmetMiddleware);

/**
 * Use the custom Cache Control middleware
 */
app.use(cacheControl);

/**
 * Compresses response bodies for all requests to improve performance.
 */
app.use(compression());

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * if you run behind a proxy (e.g. nginx, cloudflare)
 * app.set('trust proxy', 1);
 */

/**
 * Middleware for parsing cookies
 */
app.use(cookieParser());
/**
 * Parse request json
 */
app.use(express.json());

/**
 * Parses incoming requests with URL-encoded payloads
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Use the Mongo session middleware
 */
app.use(setupMongoSession());

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

/**
 * Start server
 */
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})