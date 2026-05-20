const request = require('supertest');
const app = require('../src/app'); // Importamos la app pura
const pool = require('../src/db'); // Importamos el pool

// ¡Ya no importamos vitest! Las funciones ahora son globales.

describe('API MiniBlog - Tests de Endpoints', () => {

  // Hook que se ejecuta al terminar todas las pruebas
  afterAll(async () => {
    await pool.end(); // Cerramos la conexión para que Vitest termine limpio
  });

  // --- TESTS ORIGINALES ---

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

  // --- NUEVOS TESTS PROFESIONALES ---

  test('POST /authors - Debería crear un nuevo autor con datos válidos (Status 201)', async () => {
    // Usamos Date.now() para generar un email único y evitar el error 409 de email duplicado
    const newAuthor = {
      name: 'Autor de Prueba',
      email: `test_${Date.now()}@mail.com`,
      bio: 'Creado desde los tests automáticos'
    };

    const response = await request(app).post('/authors').send(newAuthor);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newAuthor.name);
  });

  test('GET /authors/:id - Debería devolver 404 si se busca un autor que no existe', async () => {
    // Le pasamos un ID absurdamente alto que sabemos que no existe
    const response = await request(app).get('/authors/999999');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  test('DELETE /authors/:id - LA PRUEBA ESTRELLA: Borrado en cascada', async () => {
    // 1. Creamos un autor temporal
    const authorRes = await request(app).post('/authors').send({
      name: 'Autor Condenado',
      email: `borrar_${Date.now()}@mail.com`
    });
    const authorId = authorRes.body.id; // Guardamos su ID

    // 2. Le creamos un post a ese autor
    const postRes = await request(app).post('/posts').send({
      title: 'Post que va a desaparecer',
      content: 'El borrado en cascada de Postgres se encargará de esto.',
      author_id: authorId
    });
    const postId = postRes.body.id; // Guardamos el ID del post

    // 3. Borramos al autor
    const deleteRes = await request(app).delete(`/authors/${authorId}`);
    expect(deleteRes.status).toBe(200);

    // 4. Verificamos que Postgres haya borrado el post automáticamente
    // Si intentamos buscar ese post, nos TIENE que dar un error 404
    const getPostRes = await request(app).get(`/posts/${postId}`);
    expect(getPostRes.status).toBe(404);
    expect(getPostRes.body.error).toBe('Post no encontrado');
  });

});