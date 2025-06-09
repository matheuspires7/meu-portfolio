const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mysql = require('mysql2');
const methodOverride = require('method-override'); 

// Configurar conexão com MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'fatec',
  database: 'portfolio'
});

// Conectar ao banco
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

// Configura o EJS como motor de templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Torna os arquivos estáticos acessíveis (CSS, imagens, etc)
app.use(express.static(path.join(__dirname, "public")));

// Middleware para lidar com formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ativa o suporte a métodos PUT e DELETE via _method
app.use(methodOverride('_method'));

// Página inicial
app.get("/", (req, res) => {
  res.render("index");
});

// Página de listagem de projetos (do banco)
app.get('/projects', (req, res) => {
  const sql = 'SELECT * FROM projetos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar projetos:', err);
      return res.status(500).send('Erro no servidor');
    }
    res.render('projects', { projetos: results });
  });
});

// Página de formulário para novo projeto
app.get('/formulario', (req, res) => {
  res.render('formulario', { projeto: null }); 
});

// Página de formulário para editar um projeto existente
app.get('/formulario/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM projetos WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar projeto para edição:', err);
      return res.status(500).send('Erro ao buscar projeto');
    }
    if (results.length === 0) {
      return res.status(404).send('Projeto não encontrado');
    }
    res.render('formulario', { projeto: results[0] }); 
  });
});

// Inserir novo projeto
app.post('/projects', (req, res) => {
  const { nome, descricao } = req.body;
  const sql = 'INSERT INTO projetos (nome, descricao) VALUES (?, ?)';
  db.query(sql, [nome, descricao], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar projeto:', err);
      return res.status(500).send('Erro ao adicionar projeto');
    }
    res.redirect('/projects');
  });
});

// Atualizar projeto existente
app.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  const sql = 'UPDATE projetos SET nome = ?, descricao = ? WHERE id = ?';
  db.query(sql, [nome, descricao, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar projeto:', err);
      return res.status(500).send('Erro ao atualizar projeto');
    }
    res.redirect('/projects');
  });
});

// Deletar projeto
app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM projetos WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Erro ao excluir projeto:', err);
      return res.status(500).send('Erro ao excluir projeto');
    }
    res.redirect('/projects');
  });
});

// Buscar um projeto pelo ID
app.get('/projects/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM projetos WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar projeto por ID:', err);
      return res.status(500).send('Erro no servidor');
    }

    if (results.length === 0) {
      return res.status(404).send('Projeto não encontrado');
    }

    res.json(results[0]); 
  });
});

// Listar todos os projetos
app.get('/list/projects', (req, res) => {
  const sql = 'SELECT * FROM projetos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar projetos:', err);
      return res.status(500).send('Erro no servidor');
    }
    res.json(results); 
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
