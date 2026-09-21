const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('escola.db');

db.exec(`
CREATE TABLE IF NOT EXISTS alunos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
nota REAL
)
`);

const inserir = db.prepare(`INSERT INTO alunos (nome , nota ) VALUES (?, ?) `);
inserir.run(`Ana`, 8.5);
inserir.run(`Bruno`, 7.0);
inserir.run(`Carlos`, 9.2);
console.log(" Alunos inseridos !");

const buscarTodos = db.prepare(`SELECT * FROM alunos`);
const alunos = buscarTodos.all();
console.log(alunos);

const buscarPorId = db.prepare(`SELECT * FROM alunos WHERE id = ?`);
const aluno = buscarPorId.get(2);
console.log(aluno);

const aprovados = db.prepare(`SELECT * FROM alunos WHERE nota >= ?`).all(7);
console.log(aprovados);

const atualizar = db.prepare(`UPDATE alunos SET nota = ? WHERE id = ?`);
atualizar.run(10.0, 1);
const remover = db.prepare(`DELETE FROM alunos WHERE id = ?`);
remover.run(3);

const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('loja.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL
  )
`);
console.log("Tabela 'produtos' criada com sucesso!");

const inserir = db.prepare(`INSERT INTO produtos (nome, preco) VALUES (?, ?)`);

inserir.run('Teclado Mecânico', 350.00);
inserir.run('Mouse Gamer', 180.50);
inserir.run('Monitor 144Hz', 1200.00);
inserir.run('Pad Mouse XL', 89.90);

console.log("\n4 Produtos inseridos com sucesso!");

const buscarTodos = db.prepare(`SELECT * FROM produtos`);

console.log("\n--- Exercício 3: Todos os produtos ---");
console.log(buscarTodos.all());

const buscarCaros = db.prepare(`SELECT * FROM produtos WHERE preco > ?`);
const precoFiltro = 200.00;

console.log(`\n--- Exercício 4: Produtos com preço acima de R$ ${precoFiltro} ---`);
console.log(buscarCaros.all(precoFiltro));

const atualizar = db.prepare(`UPDATE produtos SET preco = ? WHERE id = ?`);
const remover = db.prepare(`DELETE FROM produtos WHERE id = ?`);

atualizar.run(150.00, 2);

remover.run(4);

console.log("\n--- Exercício 5: Lista final após Atualização (id 2) e Remoção (id 4) ---");
console.log(buscarTodos.all());
