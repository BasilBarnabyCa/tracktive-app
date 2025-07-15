	require('dotenv').config();
	const express = require('express');
	const cors = require('cors');
	const morgan = require('morgan');

	const app = express();

	const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
		.split(',')
		.map(origin => origin.trim());

	// Enhanced CORS Configuration
	const corsOptions = {
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				console.warn('CORS blocked for origin:', origin);
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Store-Id'],
		credentials: true,
	};
	
	app.use(cors(corsOptions));
	
	app.use(express.json());																							
	app.use(express.urlencoded({ extended: true }));
	app.use(morgan('dev'));

	// Health check
	app.get('/', (req, res) => {
		res.send('Tracktive API is running!');
	});

	app.get('/health', (req, res) => {
		res.status(200).send('OK');
	});

	// Start the server
	app.listen(process.env.PORT, () => {
		console.log(`Server is running on port ${process.env.PORT}`);
		console.log(`http://localhost:${process.env.PORT}`);
		console.log(`Allowed Origins: ${process.env.ALLOWED_ORIGINS}`);
	});