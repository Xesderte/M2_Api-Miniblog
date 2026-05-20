# 📝 Miniblog API - Documentación del Proyecto

Bienvenido a la documentación oficial de la **Miniblog API**. Este sistema expone un backend RESTful profesional y escalable desarrollado con **Node.js**, **Express v5** y **PostgreSQL**. La API gestiona un ecosistema de microblogging interconectando tres entidades relacionales: Autores, Publicaciones (Posts) y Comentarios.

---

## 📋 1. Descripción del Proyecto

La API es el motor encargado de garantizar la persistencia e integridad de los datos en una plataforma de blogs. El diseño prioriza la modularización del código para asegurar un alto rendimiento.

**Mecanismo de Borrado en Cascada (`ON DELETE CASCADE`)**:
Se configuraron restricciones nativas de cascada en PostgreSQL. Cuando un Autor es eliminado mediante `DELETE /authors/:id`, la base de datos destruye en cadena y automáticamente todas sus publicaciones y comentarios. A su vez, si se elimina una publicación, se borran sus comentarios asociados. Esto garantiza la integridad referencial y evita la existencia de "datos basura".

---

## 💻 2. Requisitos y Pasos para Ejecutar en Local

### Prerrequisitos
* **Node.js**: Versión v18 o superior.
* **PostgreSQL**: Instancia local corriendo activamente (v14 o superior).

### Paso 1: Instalar Dependencias
Clona el proyecto e instala las dependencias de producción y desarrollo (`express`, `pg`, `vitest`, `supertest`, etc.):

```bash
git clone https://github.com/Xesderte/M2_Api-Miniblog.git
cd M2_Api-Miniblog
npm install
```

### Paso 2: Ejecutar el Setup SQL (`setup.sql`)
Abre pgAdmin (o usa la terminal `psql`), crea una base de datos llamada `miniblog_db`, y ejecuta el script completo que se encuentra en `db/setup.sql`. Este script creará las tablas de Autores, Posts y Comentarios con sus respectivas llaves foráneas (`FOREIGN KEY`) y cargará datos iniciales de prueba.

### Paso 3: Configurar Variables de Entorno (`.env`)
Crea un archivo `.env` en la raíz del proyecto. Este archivo no se sube a GitHub por seguridad.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_db
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_postgres
```

### Paso 4: Lanzar el Servidor
Levanta la API en modo desarrollo con recarga automática:

```bash
npm run dev
```

---

## 🧪 3. Cómo Ejecutar los Tests

El proyecto cuenta con una robusta suite de pruebas de integración usando **Vitest** y **Supertest**. Las pruebas verifican el estado del servidor, respuestas correctas, manejo de errores y validan el borrado en cascada.

Para correr los tests en tu terminal, ejecuta:

```bash
npm test
```
*(Para salir del modo interactivo, presiona `q`).*

Para ver los resultados en una interfaz gráfica en tu navegador:

```bash
npm run test:ui
```

---

## 📖 4. Documentación OpenAPI (Swagger UI)

La API está documentada bajo el estándar OpenAPI v3 (`openapi.yaml`). Puedes probar los endpoints, ver qué datos enviar y qué códigos de estado HTTP devuelve el servidor directamente desde tu navegador.

* **En Local:** Inicia tu servidor (`npm run dev`) e ingresa a [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
* **En Producción:** Agrega `/api-docs` al final de tu dominio de Railway (Ej: `https://tu-proyecto.up.railway.app/api-docs`).

---

## ☁️ 5. Guía de Deployment en Railway

La API está optimizada para su despliegue continuo en **Railway**.

### Variables de Entorno (Environment Variables)
En el panel de Railway, no uses el `.env` local. Ve a **Variables** y asegúrate de que el puerto se asigne solo. Lo más importante es que conectes tu base de datos y Express use la variable `DATABASE_URL` (que Railway autogenera y nuestro código detecta automáticamente).

### Comandos de Despliegue (Settings)
Para evitar que el proyecto quede en un estado de "Deploying" infinito, ve a **Settings > Build & Deploy** y configúralo así:

* **Build Command:** `npm install`
* **Start Command:** `npm start` *(NUNCA usar `npm run dev` ni `nodemon` en producción).*

### Public URL vs Internal URL
* **Public URL:** Es el dominio con HTTPS que te da Railway (ej. `https://m2api-miniblog-production.up.railway.app`). Con esta URL puedes acceder a tu API en la nube y realizar todas las peticiones y consultas (GET, POST, PUT, DELETE) utilizando clientes REST como **Insomnia** o **Postman**, así como conectarla a tu Frontend.
* **Internal URL:** Es la dirección de red privada de Railway, usada internamente para que la app se conecte a la base de datos a máxima velocidad.

---

## 🤖 6. Registro del Uso de AI en el Proyecto

Durante el desarrollo, se utilizó IA como ingeniero de soporte y arquitectura para la resolución de 3 bloqueos críticos:

1. **La "Trampa" HTTP a HTTPS en Clientes REST:** Insomnia enviaba peticiones `POST` a Railway por `http`. Railway forzaba una redirección 301 a `https`, lo que transformaba la petición en un `GET`, devolviendo un "falso éxito" `200 OK` sin insertar datos. Solucionado forzando `https://` explícitamente en el cliente REST.
2. **Bucle de "Deploying" Infinito:** Railway quedaba compilando eternamente porque los scripts en la nube intentaban levantar `nodemon`. Se diagnosticó y se configuró estrictamente el comando de producción `npm start` (`node index.js`).
3. **Depuración Estricta de JSON (Error 400):** El middleware `express.json()` rechazaba peticiones `GET` porque Insomnia enviaba un "Body" oculto con una coma sobrante al final de una propiedad JSON. Se depuró la sintaxis y se educó sobre envíos "No Body" para rutas de lectura.
4. **Link de Consultas IA:** Puedes visualizar el registro y las capturas de pantalla de la resolución de estos problemas en el siguiente enlace: 🔗 [[Link](https://drive.google.com/drive/folders/1mOFUSq5lnfROqYXboTujs91J7cZSysH5?usp=drive_link)]

## 📦 7. Entregable Final

🔗 **Repositorio Oficial de GitHub:** [https://github.com/Xesderte/M2_Api-Miniblog.git](https://github.com/Xesderte/M2_Api-Miniblog.git)