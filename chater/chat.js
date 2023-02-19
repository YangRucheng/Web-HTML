axios.defaults.withCredentials = true;

function getInfo() {
    var url = `https://api.yangrucheng.top/account/getInfo`
    var p = new Promise(function (resolve, reject) {
        axios.post(url, JSON.stringify({
            test: 'use cookies'
        })).then(function (resp) {
            resolve(resp.data)
        }).catch(function (error) {
            reject(error)
        });
    })
    return p
}

var ws = null;

function createWS() {
    var ws;
    getInfo().then(function (data) {
        console.log(data)
        if (data.status == 0) {
            var token = data.info.token;
            ws = new WebSocket(`wss://api.yangrucheng.top/discuss/chat/${token}`);
            ws.onmessage = function (event) { //收到消息
                if (event.data != "heartbeat") {
                    var data = JSON.parse(event.data)
                    var messages = document.getElementById('messages')
                    var message = document.createElement('li')
                    var content = document.createTextNode(data.text)
                    message.appendChild(content)
                    messages.appendChild(message)
                } else {
                    console.log("heartbeat 心跳包")
                }
            };
            ws.onopen = function () {
                console.log("websocket连接成功!")
            };
        }
    })
    return {
        send: function (data) {
            return ws.send(data)
        },
        close() {
            ws.close()
        }
    }
}

function connect() {
    ws = createWS()
}

function sendMessage(event) {
    var input = document.getElementById("messageText")
    ws.send(JSON.stringify({
        text: input.value,
        account: '游客'
    }))
    input.value = ''
    event.preventDefault()
}
