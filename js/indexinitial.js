//将在这一版里面实现消息的本地化存储
//修复了之前关于下拉选择其中sessionId与session内容不匹配的问题，实现了页面加载查出来自动创建第一个对话
//修复了删除sessionId与session内容不匹配的问题
//使用api实现聊天（而不是固定的匹配）
//优化了消息渲染逻辑（每次只追加一条，而不是全部重新渲染）
//添加了对于md格式输出的解析功能




let sessions = {}; // 对象，所有的对话组
let currentSessionId = null; // 记录当前所在会话（大对象的键），字符串


//初始化部分
// 保存所有会话数据到 localStorage
function saveSessionsToLocalStorage() {
    try {
        localStorage.setItem('chatSessions', JSON.stringify(sessions));
        localStorage.setItem('currentSessionId', currentSessionId);
    } catch (error) {
        console.error('保存会话数据到localStorage时出错:', error);
    }
}

// 从 localStorage 加载会话数据
function loadSessionsFromLocalStorage() {
    try {
        const savedSessions = localStorage.getItem('chatSessions');
        const savedCurrentSessionId = localStorage.getItem('currentSessionId');
        
        if (savedSessions) {
            sessions = JSON.parse(savedSessions);
        }
        
        if (savedCurrentSessionId && sessions[savedCurrentSessionId]) {
            currentSessionId = savedCurrentSessionId;
        }
    } catch (error) {
        console.error('从localStorage加载会话数据时出错:', error);
        // 出错时使用默认值
        sessions = {};
        currentSessionId = null;
    }
}

// 保存主题颜色到 localStorage
function saveThemeColorToLocalStorage(color) {
    try {
        localStorage.setItem('themeColor', color);
    } catch (error) {
        console.error('保存主题颜色到localStorage时出错:', error);
    }
}

// 从 localStorage 加载主题颜色
function loadThemeColorFromLocalStorage() {
    try {
        return localStorage.getItem('themeColor');
    } catch (error) {
        console.error('从localStorage加载主题颜色时出错:', error);
        return null;
    }
}
//之前的实现存在缺陷：页面刷新后不能够展示对应的session内容和sessionid 
// 添加事件监听
document.getElementById('applySettings').addEventListener('click', color);
// 页面加载时加载数据
document.addEventListener('DOMContentLoaded', function() {
    // 加载会话数据
    loadSessionsFromLocalStorage();
    // 更新会话选择器
    updateSessionSelector();
    // 设置选中项为当前会话
    if (currentSessionId && sessionSelector) {
        sessionSelector.value = currentSessionId;
    }
    // 显示当前会话的消息（只有这时是需要全部加载的）
    displayMessages();
    // 加载主题颜色
    loadcolor();
});



//主要功能区
// 新建会话
const newSessionButton = document.getElementById('newSession'); // 获取
newSessionButton.addEventListener('click', function() {
    let sessionId = `Session ${Object.keys(sessions).length + 1}`; // 获得键，是总共有多少组对话
    sessions[sessionId] = []; // 对应键的值是一个空数组//这是一组对话
    currentSessionId = sessionId; // 更新当前键（其实也就是在新建）
    updateSessionSelector();
    // 设置选中项为新建的会话
    if (sessionSelector) {
        sessionSelector.value = currentSessionId;
    }
    displayMessages(); 
    saveSessionsToLocalStorage(); // 保存到 localStorage
});

//正常发消息时只调用此函数
function addMessageToDisplay(message) {
    const messageDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    // 使用marked解析
    messageElement.innerHTML = marked.parse(message.content);
    // 使用CSS类而不是内联样式
    messageElement.classList.add(message.type === 'user' ? 'user-message' : 'system-message');
    messageDiv.appendChild(messageElement);
    
    // 自动滚动到最新消息
    messageDiv.scrollTop = messageDiv.scrollHeight;
}
// 修改displayMessages函数 使得只在必要时（如切换会话）完全重渲染
function displayMessages() {
    const messageDiv = document.getElementById('messages');
    messageDiv.innerHTML = ''; // 清空
    
    if (currentSessionId && sessions[currentSessionId]) {
        sessions[currentSessionId].forEach(message => {
            const messageElement = document.createElement('div');
            // 使用marked解析
            messageElement.innerHTML = marked.parse(message.content);
            // 使用CSS类而不是内联样式
            messageElement.classList.add(message.type === 'user' ? 'user-message' : 'system-message');
            messageDiv.appendChild(messageElement);
        });
    }
    // 自动滚动到最新消息
    messageDiv.scrollTop = messageDiv.scrollHeight;
}

// 更新会话选择器（为了新建，删除，重命名）
const sessionSelector = document.getElementById('sessionSelector');
function updateSessionSelector() {
    // 保存当前选中的值
    const currentValue = sessionSelector.value;
    
    sessionSelector.innerHTML = ''; // 先清空
    for (const session in sessions) // 给每一个键值对一个大盒子//这里是每一次的对话的名字（获取到的是键）
        { 
        const option = document.createElement('option'); // 获取，option是下拉菜单中的一个元素
        option.value = session;
        option.textContent = session; // 填内容
        sessionSelector.appendChild(option); // 加盒子
        option.classList.add('session-option');//设属性
    }
    
    // 恢复之前选中的值
    if (currentValue && sessions[currentValue]) {
        sessionSelector.value = currentValue;
    }
}

// 监听选择器的变化
//change是表单元素的一个事件类型
//其他的还有
// input：输入框内容变化时触发（比 change 更灵敏）。
// focus：元素获得焦点时触发。
// blur：元素失去焦点时触发。
// submit：表单提交时触发。
sessionSelector.addEventListener('change', function(e) {
    currentSessionId = e.target.value;
    displayMessages();
    saveSessionsToLocalStorage(); // 保存到 localStorage
});

// 发送消息功能
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('send');

// 发送消息功能
function sendMessage() {
    // 创建用户消息对象（简化结构）
    let userMessage = {
        content: userInput.value,
        type: 'user' // 标记为用户消息
    };
    
    // 记录用户消息
    if (userMessage.content && currentSessionId) {
        sessions[currentSessionId].push(userMessage); // 记录消息
        // displayMessages();
        // 只添加新消息而不是重新渲染整个列表
        addMessageToDisplay(userMessage);
        userInput.value = ''; // 清空输入框
        
        // 回复消息功能
        responseMessage(userMessage);
        saveSessionsToLocalStorage(); // 保存到 localStorage
        // 发送消息后也滚动到底部
        const messageDiv = document.getElementById('messages');
        messageDiv.scrollTop = messageDiv.scrollHeight;
    }
}

sendButton.addEventListener('click', sendMessage);

//增加一个enter键发送消息的功能
userInput.addEventListener('keyup',function(e){
    if(e.key === 'Enter')
    sendMessage();
})
//回复消息功能（利用api实现真正的对话）
// 根据用户输入回复消息
async function responseMessage(userMessage) {
    // 创建系统消息对象（简化结构）
    let systemMessage = {
        content: '正在思考中...',
        type: 'system'
    };
    
    // 先显示"正在思考"的消息
    sessions[currentSessionId].push(systemMessage);
    displayMessages();
    
    try {
        // 调用百度千帆API
        const response = await callAPI(userMessage.content);
        systemMessage.content = response;
    } catch (error) {
        console.error('API调用错误:', error);
        systemMessage.content = '抱歉，我在思考时遇到了一些问题，请稍后再试。';
    }
    
    // 更新显示
    displayMessages();
    saveSessionsToLocalStorage();
}

// 调用DeepSeek API的函数（适用于浏览器环境）
async function callAPI(userInput) {
    // 你的DeepSeek API Key
    const apiKey = 'sk-83a9f248cac344349500589d2d9a5482';
    try {
        // 准备聊天历史记录
        const messages = [];
        if (sessions[currentSessionId]) {
            // 只取最近几条消息以避免超出token限制
            const recentMessages = sessions[currentSessionId].slice(-6); // 取最近6条
            recentMessages.forEach(msg => {
                if (msg.content && msg.type) {
                    messages.push({
                        role: msg.type === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    });
                }
            });
        }
        // 调用DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages,
                stream: false
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API错误响应:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            // 返回AI的回复内容
            return data.choices[0].message.content;
        } else {
            throw new Error(data.error?.message || 'API调用失败');
        }
    } catch (error) {
        console.error('调用DeepSeek API时出错:', error);
        throw new Error(`API调用失败: ${error.message}`);
    }
}
// 右键点击会话选择器
const contextMenu = document.getElementById('contextMenu');
sessionSelector.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // 阻止默认右键菜单
    const selectedOption = e.target.value; // 获取当前选中的会话
    if (selectedOption) {
        currentSessionId = selectedOption; // 更新当前会话
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;//定位
        contextMenu.style.top = `${e.pageY}px`;
    }
});

// 隐藏自定义菜单
document.addEventListener('click', () => {
    contextMenu.classList.add('hidden');
});

// 处理菜单选项的点击事件
contextMenu.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        alert(`你选择了: ${event.target.textContent}`);
        contextMenu.classList.add('hidden'); // 点击后隐藏菜单
    }
});

//重命名
const renameSession = document.getElementById('renameSession');
renameSession.addEventListener('click', function(){
    const newName = prompt('请输入新会话名称:', currentSessionId);
    if (newName && !sessions[newName]) { // 确保新名称不为空且没有重复
        sessions[newName] = sessions[currentSessionId]; // 转移消息
        delete sessions[currentSessionId]; // 删除旧会话
        currentSessionId = newName; // 更新当前会话
        updateSessionSelector(); // 更新选择器
        // 设置选中项为重命名后的会话
        if (sessionSelector) {
            sessionSelector.value = currentSessionId;
        }
        displayMessages(); // 显示消息
        saveSessionsToLocalStorage(); // 保存到 localStorage
    }
    contextMenu.style.display = 'none'; // 隐藏右键菜单
});

// 删除会话功能
const messageDiv = document.getElementById('messages')
const deleteSessionMenu = document.getElementById('deleteSessionMenu');

// 添加 deleteButton 的定义
const deleteButton = document.getElementById('deleteSession');

deleteSessionMenu.addEventListener('click', function() {
    if (currentSessionId) {
        delete sessions[currentSessionId];
        
        // 检查是否还有其他会话
        const sessionKeys = Object.keys(sessions);
        if (sessionKeys.length > 0) {
            // 如果有其他会话，选择第一个会话
            currentSessionId = sessionKeys[0];
        } else {
            // 如果没有会话了，创建一个新的默认会话
            let sessionId = `Session ${Object.keys(sessions).length + 1}`;
            sessions[sessionId] = [];
            currentSessionId = sessionId;
        }
        
        updateSessionSelector();
        // 设置选中项为当前会话
        if (sessionSelector) {
            sessionSelector.value = currentSessionId;
        }
        displayMessages();
        saveSessionsToLocalStorage(); // 保存到 localStorage
    }
    contextMenu.style.display = 'none'; // 隐藏右键菜单
});

deleteButton.addEventListener('click', function() {
    if (currentSessionId) {
        delete sessions[currentSessionId];
        
        // 检查是否还有其他会话
        const sessionKeys = Object.keys(sessions);
        if (sessionKeys.length > 0) {
            // 如果有其他会话，选择第一个会话
            currentSessionId = sessionKeys[0];
        } else {
            // 如果没有会话了，创建一个新的默认会话
            let sessionId = `Session ${Object.keys(sessions).length + 1}`;
            sessions[sessionId] = [];
            currentSessionId = sessionId;
        }
        
        updateSessionSelector();
        // 设置选中项为当前会话
        if (sessionSelector) {
            sessionSelector.value = currentSessionId;
        }
        displayMessages();
        saveSessionsToLocalStorage(); // 保存到 localStorage
    }
});

// 点击空白处隐藏右键菜单
window.addEventListener('click', function() {
    contextMenu.style.display = 'none';
});

//个性化（终于要开始了吗）
let bgcolor = document.getElementById('bgColor');
function color() {
    let colorInput = document.querySelector("#bgColor"); // 获取背景颜色选择器元素
    let themeColor = colorInput.value;
    // 设置背景颜色
    bgcolor.style.backgroundColor = themeColor; 
    saveThemeColorToLocalStorage(themeColor); // 保存主题颜色
    applyThemeColor(themeColor); // 应用主题颜色到其他元素
}

function loadcolor() {
    let usedcolor = loadThemeColorFromLocalStorage();
    if (usedcolor) {
        bgcolor.style.backgroundColor = usedcolor; // 设置背景颜色
        applyThemeColor(usedcolor);
    }
}

// 应用主题颜色到页面元素
function applyThemeColor(color) {
    const elements = document.querySelectorAll('header, button, .session-option'); // 选择多个元素
    elements.forEach(element => {
        element.style.backgroundColor = color;
        // 特别处理下拉选择器以及下拉选项
        if (sessionSelector) {
            sessionSelector.style.backgroundColor = color;
            const options = document.querySelectorAll('.session-option');
            options.forEach(option => {
                option.style.backgroundColor = color;
            })
        }
    });
}
// 更新会话选择器（为了新建，删除，重命名）
function updateSessionSelector() {
    // 保存当前选中的值
    const currentValue = sessionSelector.value;
    
    sessionSelector.innerHTML = ''; // 先清空
    for (const session in sessions) {
        const option = document.createElement('option');
        option.value = session;
        option.textContent = session;
        sessionSelector.appendChild(option);
        option.classList.add('session-option');
    }
    
    // 恢复之前选中的值
    if (currentValue && sessions[currentValue]) {
        sessionSelector.value = currentValue;
    }
    
    // 应用当前主题颜色
    const savedColor = loadThemeColorFromLocalStorage();
    if (savedColor) {
        sessionSelector.style.backgroundColor = savedColor;
    }
}
