import cors from 'cors'
import express, {Express, Response, Request} from 'express'
import http from 'http'
import bodyParser from "body-parser";
import { Server } from 'socket.io'
import { messageObject} from "~~/utils/types";
import axios, {AxiosResponse} from 'axios'
import 'dotenv/config';

const app: Express = express();
const server: http.Server = http.createServer(app);
const API_ENDPOINT: string = 'http://localhost:3333/api/'

let token: string;

let corsOptions: {origin: string[]} = {
    origin: ['http://localhost:3000/', 'http://127.0.0.1/', '*'], // changer au besoin
}

const io: Server = new Server(server, {
    cors: {
        origin: '*'
    }
})

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.get('/', (req: Request, res: Response) => {
    res.send('Websocket server');
});

io.on('connection', socket => {
    console.log('a user connected', socket.id)

    socket.on('disconnecting', (): void => {
       // console.log(socket.rooms)

    })

    socket.on('disconnect', (data): void => {
        console.log('user disconnected', socket.id)
       socket.rooms.clear()
    })

    let oldRoom: string;
    socket.on('room', (room: string, auth): void => {
    console.log("connected to room", room)

    let token = socket.handshake.query.token
    socket.leave(oldRoom)
    socket.join(room)
    oldRoom = room
      /*axios.get(`${API_ENDPOINT}conversation-messages/messages/${room}`,{
           headers: {
               'Authorization': 'Bearer ' + token,
               'Content-Type': 'application/json'
           },
       })
        .then((res: AxiosResponse) => {
            if(res.data.length > 0) {
                console.log(`Found ${res.data.length} message(s) for conversation_id ${room}`)
                socket.emit('message', res.data)
            } else {
                console.log(`No message found for conversation_id ${room}`)
            }
        })
        .catch((err: any) => {
            console.log(err)
        })*/
    })

    socket.on('message', (data: messageObject): void => {
        console.log(data)
        let token = socket.handshake.query.token
       /* axios.post(`${API_ENDPOINT}conversation-messages`,
        {
                message: data.message,
                sentAt: data.sentAt,
                type: data.type,
                conversation_id: JSON.parse(data.conversationId)
            },
            {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        })
            .then((res: AxiosResponse) => {
                console.log("message sent")
            })
            .catch((err: any) => {
                console.log(err)
            })*/

        let conversationId: string = data.conversationId.toString()
        io.to(conversationId).emit('message', data)
    })



    socket.on('isTyping', (to: messageObject["conversationId"], user: messageObject["userId"]): void => {
        io.to(to).emit('isTyping', user)
    })
})

const port = process.env.PORT || 5555
server.listen(port, () => {
    console.log(`listening on *:${port}`);
})

