const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const app = express();

app.use(express.json());

const db = new DatabaseSync('treinos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS treinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    duracao INTEGER NOT NULL
  )
`);