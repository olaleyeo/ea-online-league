import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

import tournamentRoutes from './routes/tournaments';
import fixtureRoutes from './routes/fixtures';
import standingRoutes from './routes/standings';
import knockoutRoutes from './routes/knockouts';
import aiRoutes from './routes/ai';

app.use('/api/tournaments', tournamentRoutes);
app.use('/api', fixtureRoutes); // Contains fixture routes
app.use('/api', standingRoutes); // Contains standings routes
app.use('/api', knockoutRoutes); // Contains knockout routes
app.use('/api', aiRoutes); // Contains ai routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
