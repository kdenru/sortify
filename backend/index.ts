import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Пока просто стартуем сервер
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
