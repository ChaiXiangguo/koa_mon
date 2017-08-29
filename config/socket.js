 module.exports = function(socketio) {
     var users = []; //保存所有在线用户的昵称
     global.io.on('connection', function(socket) {
         //昵称设置
         //  socket.userIndex = req.session.user;
         //  socket.nickname = req.session.user;
         //  socket.emit('loginSuccess');
         //接收新消息
         socket.on('login', function(msg) {
             socket.userIndex = users.length;
             socket.nickname = msg;
             users.push(msg);
             //将消息发送到除自己外的所有用户
             io.sockets.emit('system', msg, users.length, 'login'); //向所有连接到服务器的客户端发送当前登陆用户的昵称
         });
         socket.on('postMsg', function(msg) {
             console.log(msg)
                 //将消息发送到除自己外的所有用户
             socket.broadcast.emit('newMsg', socket.nickname, msg, 'blue');
         });
         socket.on('disconnect', function() {
             //将断开连接的用户从users中删除
             users.splice(socket.userIndex, 1);
             //通知除自己以外的所有人
             socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
         });
         //接收用户发来的图片
         socket.on('img', function(imgData) {
             //通过一个newImg事件分发到除自己外的每个用户
             socket.broadcast.emit('newImg', socket.nickname, imgData);
         });
     })
 }