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
