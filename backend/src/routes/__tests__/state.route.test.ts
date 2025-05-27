import request from 'supertest';
import express from 'express';
import stateRouter from '../state.route';

const app = express();
app.use(express.json());
app.use('/state', stateRouter);

describe('/state route', () => {
  beforeEach(async () => {
    await request(app).post('/state').send({ selectedIds: [], sortedIds: [] });
  });

  it('GET /state возвращает дефолтное состояние', async () => {
    const res = await request(app).get('/state');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ selectedIds: [], sortedIds: [] });
  });

  it('POST /state сохраняет состояние', async () => {
    const payload = { selectedIds: [1, 2, 3], sortedIds: [3, 2, 1] };
    const postRes = await request(app).post('/state').send(payload);
    expect(postRes.status).toBe(204);
    const getRes = await request(app).get('/state');
    expect(getRes.body).toEqual(payload);
  });

  it('POST /state с невалидными данными возвращает 400', async () => {
    const res = await request(app).post('/state').send({ selectedIds: 'bad', sortedIds: [] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
}); 