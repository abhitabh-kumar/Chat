const io=require('socket.io')(8000,{
  cors:{
    origin:'*'
  }
})
const users={};
io.on('connection',socket=>{
    socket.on('new-user-joined',naam=>{
            users[socket.id]=naam;
        socket.broadcast.emit('user-joined',naam);
    });

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message, naam:users[socket.id]})
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left-chat', users[socket.id]);
        delete users[socket.id];
    });
    
    socket.on("file-meta",function(data){
      socket.broadcast.emit("fs-meta", data.metadata);
    });
    socket.on("fs-start",function(data){
      socket.broadcast.emit("fs-share1", {});
    });
    socket.on("file-raw",function(data){
      socket.broadcast.emit("fs-share", data.buffer);
    })
})
