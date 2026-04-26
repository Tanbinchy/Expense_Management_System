const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./db/db');
const { readdirSync } = require('fs');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const routeDirectory = path.join(__dirname, 'routes');
const allowedOrigins = (process.env.CLIENT_URLS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },
};

//middlewares
app.use(express.json());
app.use(cors(corsOptions));

//routes
app.get('/', (_req, res) => {
    res.status(200).json({ message: 'EMS API is running.' });
});

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

readdirSync(routeDirectory).forEach((route) => {
    app.use('/api/v1', require(path.join(routeDirectory, route)));
});

const server = () => {
    db();
    app.listen(PORT, () => {
        console.log('listening to port:', PORT);
    });
};

server();
