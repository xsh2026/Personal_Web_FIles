const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 获取留言列表
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await db.getAllMessages();
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 新增留言
app.post('/api/messages', async (req, res) => {
    const { nickname, content, password } = req.body;
    if (!nickname || !content || !password) {
        return res.status(400).json({ error: '昵称、留言内容、密码均不能为空' });
    }
    try {
        const result = await db.createMessage(nickname, content, password);
        res.status(201).json({ id: result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '发布失败' });
    }
});

// 修改留言（需要密码验证）
app.put('/api/messages/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { content, password } = req.body;
    if (!content || !password) {
        return res.status(400).json({ error: '新内容和密码不能为空' });
    }
    try {
        await db.updateMessage(id, content, password);
        res.json({ success: true });
    } catch (err) {
        let msg = err.message;
        if (msg === '留言不存在') return res.status(404).json({ error: '留言不存在' });
        if (msg === '密码错误') return res.status(403).json({ error: '密码错误，无法修改' });
        res.status(500).json({ error: '修改失败' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});