const app = require('./src/app'); // Importa la app desde la carpeta src
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto http://localhost:${PORT}`);
});