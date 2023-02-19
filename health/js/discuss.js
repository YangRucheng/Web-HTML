
const addDiscuss = Vue.createApp({ //发布留言
    data() {
        return {
            ip: "暂未获取",
            text: '',
            qq: '',
            nickname: '',
            email: '',
            discussions: []
        }
    },
    methods: {
        addDiscuss(reply = null) { //提交留言
            var that = this;
            if (reply != -1) {
                var url = `https://api.yangrucheng.top/discuss/add?url=/health`
                axios.post(url, JSON.stringify({
                    qq: this.qq,
                    nickname: this.nickname,
                    text: this.text,
                    email: this.email,
                    device: getDeviceInfo(),
                    reply: reply
                })).then(function (resp) {
                    if (resp.data.status == 0) {
                        console.log("留言发布成功!", resp.data);
                        that.text = ""
                        alert("留言发布成功!")
                        setTimeout(getDiscussions, 200)
                    } else {
                        console.log("留言发布失败!", resp.data);
                        alert("留言发布失败!\n" + resp.data.msg)
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                alert("请使用留言后方的回复按键!")
            }

        },
        updateDiscuss(res) { //更新留言显示, 传入数组
            var that = this;
            this.discussions = []

            var insertReplyDiscussion = function (replyTarget, res) { //插入回复的评论
                for (var y in res) { //再次遍历
                    if (res[y].reply == replyTarget.id) { //如果是回复该留言的
                        res[y].styleIcon = "opacity: 0.4;"
                        res[y].styleText = "margin-left: 38px;"
                        res[y].replyName = ` 回复给 ${replyTarget.nickname}`
                        that.discussions.push(res[y]) //插入
                        insertReplyDiscussion(res[y], res)
                    }
                }
            }

            for (var x in res) { //遍历留言
                if (res[x].reply == null) { //如果是独立留言
                    res[x].styleIcon = "display: none;"
                    res[x].styleText = ""
                    res[x].replyName = ""
                    that.discussions.push(res[x]) //插入
                    insertReplyDiscussion(res[x], res)
                }
            }

        },
    }
}).mount('#discuss')


function getDiscussions(func = null) { //加载评论
    var url = `https://api.yangrucheng.top/discuss/get?url=/health`
    axios.get(url).then(function (resp) {
        console.log(resp.data.msg, resp.data.data)
        addDiscuss.updateDiscuss(resp.data.data)
        addDanmaku(resp.data.data)
        if (func != null) {
            func()
        }
    }).catch(function (error) {
        console.log(error)
    })
}
getDiscussions(function () { //加载页面时触发评论加载, 评论加载完成后关闭加载动画
    document.getElementById("loading").style.display = "none"
})


function addDanmaku(data, count = 0) { //创建弹幕, 传入留言数组
    if (count < data.length) {
        var wrapper = document.createElement('div'); //创建包裹元素
        var text = document.createElement('span'); //创建评论元素
        var img = document.createElement('img'); //创建头像元素

        wrapper.style.top = `${Math.ceil(Math.random() * 90) + 5}%`;
        wrapper.id = Math.floor(Math.random() * 100000).toString()
        wrapper.className = 'danmaku'

        img.src = data[count].qq != 0 ? `https://q1.qlogo.cn/g?b=qq&nk=${data[count].qq}&s=100` : `./img/admin-photo.jpg`
        img.className = 'danmaku-img'
        text.style.color = '#' + Math.floor(Math.random() * (2 << 23)).toString(16);   //随机颜色
        text.innerHTML = data[count].text;
        text.className = 'danmaku-text'

        document.getElementById('danmakues').appendChild(wrapper);
        document.getElementById(wrapper.id).appendChild(img);
        document.getElementById(wrapper.id).appendChild(text);
    }
    setTimeout(function () {
        addDanmaku(data, count + 1)
    }, Math.floor(Math.random() * 1 * 1000))
}

function getDeviceInfo() {
    var parser = new UAParser();
    var device = parser.getResult()
    var deviceInfo = `${device.browser.name} ${device.browser.version}   ${device.os.name} ${device.os.version}`
    console.log("获取设备信息成功", deviceInfo)
    return deviceInfo
}