const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(` Servidor rodando, gracas a Deus, em http://localhost:${PORT}`);
});