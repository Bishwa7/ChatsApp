import {WebSocketServer, WebSocket} from "ws";
const wss = new WebSocketServer({ port: 8080 })


interface IncomingMessage {
  type: "join" | "chat";
  payload?: {
    roomId?: string;
    message?: string;
  };
}


let rooms: Record<string, Set<WebSocket>> = {};


wss.on("connection", (socket) => {
    let currentRoom: string | null = null;

    socket.on("message", (data) => {
        try
        {
            let parsedData = JSON.parse(data.toString()) as IncomingMessage;
            const { type, payload } = parsedData

            if(!type || !payload){
                return
            }

            if(type === "join" && typeof payload.roomId === "string"){
                currentRoom = payload.roomId

                if(!rooms[currentRoom]) {
                    rooms[currentRoom] = new Set<WebSocket>()
                }

                rooms[currentRoom]!.add(socket)
                return;
            }


            if(type === "chat" && typeof payload.message === "string" && currentRoom)
            {
                rooms[currentRoom]?.forEach((client) => {
                    if(client.readyState === WebSocket.OPEN){
                        client.send(`${payload!.message}`)
                    }
                })
            }
        }
        catch (error)
        {
            console.error("Failed to process message", error)
        }
    })



    socket.on("close", () => {
        if(currentRoom && rooms[currentRoom]){
            rooms[currentRoom]?.delete(socket)

            if(rooms[currentRoom]?.size === 0){
                delete rooms[currentRoom]
            }
        }
    })
})