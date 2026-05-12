const request = require('supertest');
const app = require('../src/app'); // Importamos la app pura
const pool = require('../src/db'); // Importamos el pool

// ¡Ya no importamos vitest! Las funciones ahora son globales.

describe('API MiniBlog - Tests de Endpoints', () => {

  // Hook que se ejecuta al terminar todas las pruebas
  afterAll(async () => {
    await pool.end(); // Cerramos la conexión para que Vitest termine limpio
  });

  test('GET /health - Debería responder con status 200 y el estado "ok"', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('db_time');
  });

  test('GET /authors - Debería devolver un arreglo (lista) de autores', async () => {
    const response = await request(app).get('/authors');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /authors - Debería rechazar la creación si falta el email (Status 400)', async () => {
    const response = await request(app)
      .post('/authors')
      .send({ name: 'Usuario Incompleto' }); 
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('obligatorios');
  });

});