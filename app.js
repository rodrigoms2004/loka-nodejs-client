process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

const authData = require('./config/auth.json')
const https = require("https")
const WebSocketClient = require("websocket").client
const client = new WebSocketClient()

//Authentication Token
const token = authData.token

//Insert your device here
const deviceId = authData.deviceId

//Subscribe devices
const optionsget = {
    host: "core.loka.systems",
    port: 443,
    path: "/subscribe_terminal/" + deviceId,
    method: "GET",
    headers: { Authorization: "Bearer " + token }
}

// do the GET request
const reqGet = https.request(optionsget, (res) => {
    console.log("statusCode: ", res.statusCode)

    res.on("data", (d) => {
        console.info("GET result:\n")
        process.stdout.write(d)
    })
})

reqGet.end()
reqGet.on("error", (e) => {
    console.error(e)
})

client.on("connectFailed", (error) => {
    console.log("Connect Error: " + error.toString())
})

client.on("connect", (connection) => {
    console.log("WebSocket Client Connected")

    connection.on("error", (error) => {
        console.log("Connection Error: " + error.toString())
    })

    connection.on("close", () => {
        console.log("echo-protocol Connection Closed")
    })

    connection.on("message", (message) => {
        if (message.type === "utf8") {
            console.log("Received: '" + message.utf8Data + "'")
        }
    })
})

client.connect(
    "wss://core.loka.systems/messages",
    null,
    null,
    { 
        Authorization: "Bearer " + token 
    },
    null
)

//Unsubscribe device when terminating
process.on("SIGINT", () => {
    console.log("Unsubscribing device...")

    optionsget.path = "/unsubscribe_terminal/" + deviceId
        const reqGet = https.request(optionsget, (res) => {
        console.log("End.")
        process.exit()
    })
    reqGet.end()
})