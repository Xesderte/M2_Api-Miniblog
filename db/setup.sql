-- =============================================================================
-- SCRIPT COMPLETO: REINICIO, CREACIÓN Y CARGA DE DATOS (Miniblog API)
-- =============================================================================

-- 1. LIMPIEZA TOTAL (Elimina tablas antiguas y limpia sus restricciones)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

-- 2. CREACIÓN DE TABLAS DESDE CERO
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CARGA DE DATOS DE PRUEBA (SEEDING)

-- Inserción de 5 Autores (IDs del 1 al 5)
INSERT INTO authors (name, email, bio) VALUES
('Ana Dev', 'ana@devspark.com', 'Backend Developer Jr'),
('Nico Code', 'nico@devspark.com', 'Entusiasta de PostgreSQL'),
('Daniel Backend', 'daniel@test.com', 'Estudiante de Sistemas y apasionado del desarrollo'),
('Maria Cloud', 'maria@cloud.com', 'Arquitecta de soluciones de infraestructura'),
('Carlos Fullstack', 'carlos@stack.com', 'Desarrollador Full Stack orientado a JavaScript');

-- Posts de Ana Dev (author_id = 1 | IDs del 1 al 5)
INSERT INTO posts (author_id, title, content, published) VALUES
(1, 'Introducción a Express v5', 'Contenido sobre las novedades de Express v5...', true),
(1, 'Middlewares en Node.js', 'Cómo controlar el flujo de las peticiones...', true),
(1, 'Manejo de errores globales', 'Centralizando excepciones con try/catch y next...', false),
(1, 'Estructura de un proyecto REST', 'Organizando carpetas de forma limpia...', true),
(1, 'Buenas prácticas en HTTP', 'Códigos de estado semánticos y su uso...', true);

-- Posts de Nico Code (author_id = 2 | IDs del 6 al 10)
INSERT INTO posts (author_id, title, content, published) VALUES
(2, 'Optimización de consultas en Postgres', 'Uso de índices y análisis de ejecución...', true),
(2, 'Integridad referencial', 'Por qué usar llaves foráneas en bases relacionales...', true),
(2, 'El peligro de los deletes sin WHERE', 'Historias de terror en producción...', false),
(2, 'Secuencias y SERIAL en PostgreSQL', 'Cómo funcionan los contadores automáticos...', true),
(2, 'Configurando Pool de conexiones', 'Mejorando el rendimiento con la librería pg...', true);

-- Posts de Daniel Backend (author_id = 3 | IDs del 11 al 15)
INSERT INTO posts (author_id, title, content, published) VALUES
(3, 'Mi primer deploy en Railway', 'Pasos clave para subir una API a la nube...', true),
(3, 'Evitando loops infinitos en la nube', 'Por qué no debes usar nodemon en producción...', true),
(3, 'Configuración de variables de entorno', 'Uso seguro de variables en paneles web...', true),
(3, 'Conexiones seguras con SSL', 'Configurando rejectUnauthorized en producción...', false),
(3, 'Testing de integración con Vitest', 'Cómo simular requests reales contra la base de datos...', true);

-- Posts de Maria Cloud (author_id = 4 | IDs del 16 al 20)
INSERT INTO posts (author_id, title, content, published) VALUES
(4, 'Arquitectura de microservicios', 'Conceptos básicos de escalabilidad...', true),
(4, 'Estrategias de CI/CD', 'Automatizando despliegues desde GitHub...', true),
(4, 'Monitoreo de servidores', 'Herramientas para vigilar logs en la nube...', true),
(4, 'Seguridad en redes internas', 'Diferencias entre Public URL e Internal URL...', false),
(4, 'Introducción a Docker', 'Contenedores para asegurar entornos idénticos...', true);

-- Posts de Carlos Fullstack (author_id = 5 | IDs del 21 al 25)
INSERT INTO posts (author_id, title, content, published) VALUES
(5, 'El salto de Junior a SemiSenior', 'Habilidades blandas y técnicas necesarias...', true),
(5, 'Dominando el asincronismo', 'Promesas, async y await sin morir en el intento...', true),
(5, 'Validación de datos con .trim()', 'Evitando strings vacíos en formularios...', true),
(5, 'Ecosistema de testing moderno', 'Por qué migrar de Jest a Vitest...', false),
(5, 'Principios SOLID en JavaScript', 'Escribiendo código mantenible y desacoplado...', true);

-- Inserción de 10 Comentarios variados
INSERT INTO comments (content, post_id, author_id) VALUES 
('¡Excelente artículo de Express! Me sirvió muchísimo.', 1, 2),
('Tengo una duda con el ciclo de vida del pool.', 10, 1),
('Railway es espectacular, gran tutorial.', 11, 4),
('Totalmente de acuerdo con no usar nodemon en producción.', 12, 5),
('¿Recomiendas usar Docker en proyectos pequeños?', 20, 3),
('El artículo sobre .trim() me salvó de un bug feo.', 23, 2),
('Buenísimo el enfoque de códigos de estado HTTP.', 5, 5),
('¿Qué índices recomiendas para tablas de auditoría?', 6, 3),
('SOLID cambió por completo mi forma de programar.', 25, 1),
('Me quedó una duda sobre las redes internas aisladas.', 19, 2);