import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import listEndpoints from 'express-list-endpoints';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`INCOMING REQUEST: ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api', (req, res) => {
    res.send('AI Research Synthesizer API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/idea', ideaRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/documents', documentRoutes);

console.log('\nRegistered routes:\n', listEndpoints(app), '\n');

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
