# Websockets

## Requirements
- min. Node v.18

## Installation 

- npm install

## Scripts:


`npm run dev` > Start the development server

`npm run build` > Compile the Typescript

`npm run start` > Start the compiled project


## Usage

To connect to a specific room: 

```js
socket.emit("room", 'roomName')
```

Receive the messages

```javascript   
socket.on("message", (data) => {
    // data contains every messages informations (date, user, content...)
})
```

Send the messages
```javascript
socket.emit('message', data)
```




