// 后端 API 基础地址 (部署时请替换为实际后端地址)
const API_BASE = 'http://localhost:3000/api';   // 本地开发默认；生产环境可改成 https://www.xushuhe.com/api

// 获取留言列表并渲染
async function fetchMessages() {
    try {
        const res = await fetch(`${API_BASE}/messages`);
        if (!res.ok) throw new Error('fetch failed');
        const messages = await res.json();
        renderMessages(messages);
    } catch (err) {
        console.error(err);
        document.getElementById('messagesList').innerHTML = '<div class="empty-placeholder">加载留言失败，请稍后重试</div>';
    }
}

// 渲染留言列表，并为每条留言绑定编辑功能（使用密码修改）
function renderMessages(messages) {
    const container = document.getElementById('messagesList');
    if (!messages || messages.length === 0) {
        container.innerHTML = '<div class="empty-placeholder">暂无留言，成为第一个留言的朋友吧</div>';
        return;
    }
    // 按时间倒序（最新的在上）
    const sorted = [...messages].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    container.innerHTML = sorted.map(msg => `
        <div class="message-item" data-id="${msg.id}">
            <div class="message-header">
                <span class="message-nickname">${escapeHtml(msg.nickname)}</span>
                <span class="message-time">${formatTime(msg.created_at)}</span>
            </div>
            <div class="message-content" id="content-${msg.id}">${escapeHtml(msg.content)}</div>
            <div class="message-actions">
                <button class="btn-edit" data-id="${msg.id}">修改留言</button>
            </div>
        </div>
    `).join('');

    // 为所有编辑按钮绑定事件
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const msgId = btn.getAttribute('data-id');
            showEditForm(msgId);
        });
    });
}

// 显示编辑表单（内嵌修改，需要输入原密码）
function showEditForm(messageId) {
    const messageDiv = document.querySelector(`.message-item[data-id="${messageId}"]`);
    const contentDiv = document.getElementById(`content-${messageId}`);
    if (!messageDiv || !contentDiv) return;

    const oldContent = contentDiv.innerText;
    // 隐藏原内容区域，插入编辑表单
    contentDiv.style.display = 'none';
    const editFormHtml = `
        <div class="edit-form" id="edit-form-${messageId}">
            <textarea id="edit-text-${messageId}" rows="2">${escapeHtml(oldContent)}</textarea>
            <div class="edit-actions">
                <input type="password" id="edit-pwd-${messageId}" placeholder="输入发布时的密码" style="flex:1; padding:0.3rem; border-radius:20px; border:1px solid #ccc;">
                <button class="save-edit" data-id="${messageId}">保存</button>
                <button class="cancel-edit" data-id="${messageId}">取消</button>
            </div>
        </div>
    `;
    // 在contentDiv后面插入编辑区
    contentDiv.insertAdjacentHTML('afterend', editFormHtml);
    // 绑定保存/取消
    const saveBtn = document.querySelector(`.save-edit[data-id="${messageId}"]`);
    const cancelBtn = document.querySelector(`.cancel-edit[data-id="${messageId}"]`);
    saveBtn.addEventListener('click', () => updateMessage(messageId));
    cancelBtn.addEventListener('click', () => {
        document.getElementById(`edit-form-${messageId}`).remove();
        contentDiv.style.display = 'block';
    });
}

// 更新留言（需要密码验证）
async function updateMessage(messageId) {
    const newContent = document.getElementById(`edit-text-${messageId}`).value.trim();
    const password = document.getElementById(`edit-pwd-${messageId}`).value;
    if (!newContent) {
        alert('留言内容不能为空');
        return;
    }
    if (!password) {
        alert('请填写发布时使用的密码');
        return;
    }
    try {
        const res = await fetch(`${API_BASE}/messages/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newContent, password })
        });
        const data = await res.json();
        if (res.ok) {
            // 更新成功，刷新列表
            fetchMessages();
        } else {
            alert(data.error || '修改失败，密码错误或留言不存在');
            // 刷新列表让错误信息消失并恢复原样
            fetchMessages();
        }
    } catch (err) {
        console.error(err);
        alert('网络错误，请稍后重试');
        fetchMessages();
    }
}

// 发布新留言
async function submitMessage() {
    const nickname = document.getElementById('msgNickname').value.trim();
    const content = document.getElementById('msgContent').value.trim();
    const password = document.getElementById('msgPassword').value;
    if (!nickname || !content) {
        alert('昵称和留言内容不能为空');
        return;
    }
    if (!password) {
        alert('请设置编辑密码，以便后续修改留言');
        return;
    }
    try {
        const res = await fetch(`${API_BASE}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, content, password })
        });
        const data = await res.json();
        if (res.ok) {
            // 清空表单（保留密码字段可不清，但清空更友好）
            document.getElementById('msgNickname').value = '';
            document.getElementById('msgContent').value = '';
            document.getElementById('msgPassword').value = '';
            fetchMessages(); // 重新加载列表
        } else {
            alert(data.error || '发布失败');
        }
    } catch (err) {
        console.error(err);
        alert('发布失败，请检查网络');
    }
}

// 辅助函数：转义HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

function formatTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
}

// 页面加载时获取留言，并为发布按钮绑定事件
document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();
    const submitBtn = document.getElementById('submitMessageBtn');
    if (submitBtn) submitBtn.addEventListener('click', submitMessage);
});