const socket = io("http://localhost:8000");
const form = document.getElementById('send-container');
const messageInput = document.getElementById('mess');
const messageContainer = document.querySelector(".chating")
var audio = new Audio('js/ting.mp3');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}
const gain = (naam, message, position) => {
    const message1 = document.createElement('div');
    message1.innerText = message;
    message1.classList.add('message');
    message1.classList.add(position);
    messageContainer.append(message1);
    if (position == 'left') {
        audio.play();
    }

}
const naam = prompt("enter our name");
socket.emit('new-user-joined', naam);

socket.on('user-joined', naam => {
    append(`${naam} joined the chat`, 'center');
})
socket.on('receive', data => {
    gain(`${data.naam}`, `${data.message}`, 'left');
})
socket.on('left-chat', naam => {
    append(`${naam} left the chat`, 'center');
})



document.querySelector("#khulja").addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
        let buffer = new Uint8Array(reader.result);

        let el = document.createElement("div");
        el.classList.add("message");
        el.classList.add("right");
        el.innerHTML = `
                <div class="progress">0%</div>
                <div class="filename">${file.name}</div>
        `;
        document.querySelector(".chating").appendChild(el);
        shareFile({
            filename: file.name,
            total_buffer_size: buffer.length,
            buffer_size: 1024,
        }, buffer, el.querySelector(".progress"));
    }
    reader.readAsArrayBuffer(file);
});
function shareFile(metadata, buffer, progress_node) {
    socket.emit("file-meta", {
        metadata: metadata
    });

    socket.on("fs-share1", function () {
        let chunk = buffer.slice(0, metadata.buffer_size);
        buffer = buffer.slice(metadata.buffer_size, buffer.length);
        progress_node.innerText = Math.trunc(((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100));
        if (chunk.length != 0) {
            socket.emit("file-raw", {
                buffer: chunk
            });
        } else {
            console.log("Sent file successfully");
        }
    });
}

let fileShare = {};
socket.on("fs-meta", function (metadata) {
    fileShare.metadata = metadata;
    fileShare.transmitted = 0;
    fileShare.buffer = [];

    let el = document.createElement("div");
    el.classList.add("message");
    el.classList.add("left");
    el.innerHTML = `
				<div class="progress1">0%</div>
				<div class="filename1">${metadata.filename}</div>
		`;
    document.querySelector(".chating").appendChild(el);

    fileShare.progrss_node = el.querySelector(".progress1");

    socket.emit("fs-start");
});
socket.on("fs-share",function(buffer){
    console.log("Buffer", buffer);
    fileShare.buffer.push(buffer);
    fileShare.transmitted += buffer.byteLength;
    fileShare.progrss_node.innerText = Math.trunc(fileShare.transmitted / fileShare.metadata.total_buffer_size * 100);
    if(fileShare.transmitted == fileShare.metadata.total_buffer_size){
        console.log("Download file: ", fileShare);
        download(new Blob(fileShare.buffer), fileShare.metadata.filename);
        fileShare = {};
    } else {
        socket.emit("fs-start");
    }
});