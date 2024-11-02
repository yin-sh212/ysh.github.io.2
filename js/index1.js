let sessions = {}; // 对象，所有的对话组
let currentSessionId = null; // 记录当前所在会话（大对象的键），字符串

// 新建会话
const newSessionButton = document.getElementById('newSession'); // 获取
newSessionButton.addEventListener('click', function() {
    let sessionId = `Session ${Object.keys(sessions).length + 1}`; // 获得键，是总共有多少组对话,这个模板字符串得到的是字符串
    // 对应键的值是一个对象//这是一组对话，和对话的盒子
    sessions[sessionId] = { messages: [], messageDiv: document.createElement('div') };
    sessions[sessionId].messageDiv.setAttribute('id', `${sessionId}`);
    //把盒子放进去
    const messageDiv = document.getElementById('messages');
    const sessionDiv = document.getElementById(`${sessionId}`); // 获取
    messageDiv.appendChild(sessionDiv);

    currentSessionId = sessionId; // 更新当前键（其实也就是在新建）
    updateSessionSelector();
    displayMessages(); 
});
// 显示sessions[currentsessionid]
function displayMessages() {
    let sessionDiv = document.getElementById(`${currentSessionId}`); // 获取
    sessionDiv.innerHTML = ''; // 清空
    if (currentSessionId) 
        {
            sessions[currentSessionId].messages.forEach(message => { // 遍历数组
                const messageElement = document.createElement('div'); // 给聊天区加盒子
                messageElement.innerHTML = message.content; // 显示内容
                sessionDiv.appendChild(messageElement); // 添加到消息区域
                //调用一个函数设置消息的css
                Object.assign(messageElement.style, message.style);
            });
        }
}
// 更新会话选择器（为了新建，删除，重命名）
const sessionSelector = document.getElementById('sessionSelector');
function updateSessionSelector() {
    sessionSelector.innerHTML = ''; // 先清空
    for (const session in sessions) // 给每一个键值对一个大盒子//这里是每一次的对话的名字（获取到的是键）
        { 
        const option = document.createElement('option'); // 获取，option是下拉菜单中的一个元素
        option.value = session;
        option.textContent = session; // 填内容
        sessionSelector.appendChild(option); // 添加DOM元素
        option.classList.add('session-option');//设属性
    }
}

// 监听选择器的变化
sessionSelector.addEventListener('change', function(e) { // target获取的实际是option
    
    for (const message of sessions[currentSessionId].messages) {
        message.style.display = 'none'
    }
    currentSessionId = e.target.value; // 更新
    for (const message of sessions[currentSessionId].messages) {
        message.style.display = 'block'
    }
    displayMessages(); 
});

// 发送消息功能
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('send');
sendButton.addEventListener('click', function() {
    let userMessage = {};//新产生了一个对象
    userMessage.content = userInput.value; 
    userMessage.style = {
        display: 'flex',  
        borderRadius: '8px',
        maxWidth: '80%',
        height: 'auto',
        padding: '4px 10px',
        margin: '3px',
        alignSelf: 'flex-end',
        textAlign: 'right',
        fontSize: '16px',
        wordWrap: 'break-word', 
        backgroundColor: 'antiquewhite',
        color: '#000',
    };
    
    // 记录用户消息
    if (userMessage.content && currentSessionId) {
        sessions[currentSessionId].messages.push(userMessage); // 记录消息//把对象放进数组中
        const userMessageDiv = document.createElement('div'); // a new div
        Object.assign(userMessageDiv.style, userMessage.style);
        userMessageDiv.innerHTML = userMessage.content; 
        const messageContainer = document.getElementById('messages');
        messageContainer.appendChild(userMessageDiv); // 将新的 div 添加到消息容器中
        userInput.value = ''; // 清空输入框

        // 回复消息功能
        responseMessage(userMessage);
    }
});

// 回复消息功能
const questions = [
    '你好',
    '你叫什么',
    '今天天气怎么样',
    '今天是星期几？',
    '再见',
    '最近在忙什么呢？'
];
const answers = [
    '你好！很高兴见到你',
    '我是焦糖工作室聊天机器人',
    '我不能提供实时天气信息，但希望你有个好天气！',
    '你可以打开手机上的日历哦，我不知道',
    '再见！期待下次见面',
    '我在学习编程，挺有趣的（）'
];

// 根据用户输入回复消息
function responseMessage(userMessage) {
    let systemMessage = {};//一个对象
    systemMessage.content = 'sorry, I cannot understand you'; // 默认回复内容（一个键值对）
    systemMessage.style = {
        display: 'flex',  
        borderRadius: '8px',
        maxWidth: '80%',
        height: 'auto',
        padding: '4px 10px',
        margin: '3px',
        alignSelf: 'flex-start',
        textAlign: 'left',
        fontSize: '16px',
        wordWrap: 'break-word', 
        backgroundColor: 'antiquewhite',
        color: '#000',
    };

    // 检查用户输入是否在问题列表中
    for (let i = 0; i < questions.length; i++) {
        if (userMessage.content === questions[i]) {
            systemMessage.content = answers[i]; // 设定系统回复
            break;
        }
    }
        sessions[currentSessionId].messages.push(systemMessage); // 记录系统消息
        displayMessages(); // 显示所有消息
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
        sessions[newName] = sessions[currentSessionId].messages; // 转移消息
        delete sessions[currentSessionId].message; // 删除旧会话
        currentSessionId = newName; // 更新当前会话
        updateSessionSelector(); // 更新选择器
        displayMessages(); // 显示消息
    }
    contextMenu.style.display = 'none'; // 隐藏右键菜单
});

// 删除会话功能
//messageDiv.removeChild()删除DOM元素
//delete删除js对象的属性或数组中元素

    const messageDiv = document.getElementById('messages')
    const deleteSessionMenu = document.getElementById('deleteSessionMenu');
    deleteSessionMenu.addEventListener('click', function() {
        if (currentSessionId) {
            //将装有当前会话的div删去（removechild）
            delete(sessions[currentSessionId]);
            //更新currentsessionid（默认回到1）
            currentSessionId = `session 1`;
            //更新消息显示
            displayMessages();          
            //更新下拉菜单
            updateSessionSelector();
        } 
        contextMenu.style.display = 'none'; // 隐藏右键菜单
    });
 
    const deleteButton = document.getElementById('deleteSession');
    deleteButton.addEventListener('click', function() {
        if (currentSessionId) {
            delete sessions[currentSessionId];
            currentSessionId = null; // 清空当前会话
            updateSessionSelector();
            messageDiv.innerHTML = ''; // 清空消息显示
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
    localStorage.setItem('savedBackgroundColor', themeColor); 
}

function loadcolor() {
    let usedcolor = localStorage.getItem('savedBackgroundColor');
    if (usedcolor) {
        bgcolor.style.backgroundColor = usedcolor; // 设置背景颜色
        const elements = document.querySelectorAll('header, button, .session-option'); // 选择多个元素
        elements.forEach(element => {
            element.style.backgroundColor = usedcolor;
        });
    }
}
// 添加事件监听
document.getElementById('applySettings').addEventListener('click', color);

// 页面加载时加载颜色
loadcolor(); 
//successful!!!!!!!