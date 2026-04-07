const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'messages.db');

const db = new sqlite3.Database(dbPath);

// 初始化表
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname TEXT NOT NULL,
            content TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// 获取所有留言（不返回密码）
const getAllMessages = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT id, nickname, content, created_at FROM messages ORDER BY created_at DESC", (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// 新增留言
const createMessage = (nickname, content, password) => {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO messages (nickname, content, password) VALUES (?, ?, ?)",
            [nickname, content, password],
            function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
    });
};

// 更新留言（需要验证密码）
const updateMessage = (id, content, password) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT password FROM messages WHERE id = ?", [id], (err, row) => {
            if (err) return reject(err);
            if (!row) return reject(new Error('留言不存在'));
            if (row.password !== password) return reject(new Error('密码错误'));
            db.run("UPDATE messages SET content = ? WHERE id = ?", [content, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    });
};

module.exports = { getAllMessages, createMessage, updateMessage };