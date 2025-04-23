const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// Configura o EJS como motor de templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Torna os arquivos estáticos (como CSS) acessíveis
app.use(express.static(path.join(__dirname, "public")));

// Rota para a página inicial
app.get("/", (req, res) => {
  res.render("index"); // Vai renderizar views/index.ejs
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
