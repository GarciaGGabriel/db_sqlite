const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./banco.db', (err) => {
    if (err) {
        console.error('ERRO FATAL: Não foi possível criar o arquivo do banco.', err.message);
    } else {
        console.log('1. Arquivo do banco conectado corretamente.');
        
        const criarTabela = `
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT,
                preco REAL
            )
        `;

        db.run(criarTabela, (erroTabela) => {
            if (erroTabela) {
                console.error('ERRO AO CRIAR TABELA:', erroTabela.message);
            } else {
                console.log('Tabela verificada ou criada corretamente.');
            }
        });
    }
});

app.get('/api/produtos', (req, res) => {
    const sql = "SELECT * FROM produtos";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.post('/api/produtos', (req, res) => {
    const { nome, preco } = req.body;
    const sql = "INSERT INTO produtos (nome, preco) VALUES (?, ?)";
    
    db.run(sql, [nome, preco], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ id: this.lastID, nome, preco });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});