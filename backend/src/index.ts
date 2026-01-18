import {WebSocketServer, WebSocket} from "ws";
const wss = new WebSocketServer({ port: 8080 })

let userCount = 0;
// let allSockets : WebSocket[] = []

wss.on("connection", (socket) => {

    // allSockets.push(socket)
    userCount = userCount + 1;
    console.log("user connected #" + userCount)



    socket.on("message", (message) => {
        console.log("message received " + message.toString())
        // socket.send(message.toString() + " : sent from server")


        // for(let i=0; i< allSockets.length; i++)
        // {
        //     let s = allSockets[i]
        //     s?.send(message.toString() + " : sent from server")
        // }

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(message.toString() +" : sent from server");
            }
        })
    })


    socket.on("close", () => {
        console.log("user disconnected")
    })
})