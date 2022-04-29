const express = require('express')
const cors = require('cors')
const SHA256 = require('crypto-js/sha256')
const prompt = require('prompt-sync')()
const axios = require('axios')
const chalk = require("chalk")

const CryptBlockchain = require('./CryptBlockchain')
const CryptBlock = require('./CryptBlock')

var config = {
    PORT: prompt("Enter PORT: "),
    USER_NAME: prompt("Enter Username: "),
    USER_PASS: prompt.hide("Enter password: "),
    EN_KEY: "",
    PACK_ID: "",
    BCLK: null
}

axios
  .post(`http://localhost:8080/register`, {
        user: config.USER_NAME,
        pass: config.USER_PASS,
        PORT: config.PORT
  })
  .then(res => {
    config.EN_KEY = res.data["key"]
    config.PACK_ID = prompt("Enter Package ID: ")
    config.BCLK = new CryptBlockchain(id=config.PACK_ID, res.data.blockchain.blockchain)
    console.log(`\n\n${chalk.green("Registered Successfully")}: ${config.EN_KEY}\n`);
    axios
        .post(`http://localhost:8080/add`, {
            id: config.PACK_ID,
            data: prompt("Enter Status: "),
            PORT: config.PORT,
            hash: config.BCLK.obtainLatestBlock().hash
        })
        .then(res => {
            console.log("Adding block")
        })
        .catch(err => {
            console.error("Invalid Package ID")
            process.exit(1)
        })
  })
  .catch(error => {
    console.log(`statusCode: ${error.status}`);
    console.error(`${chalk.yellow("ERROR")}: ${error}`);
    process.exit(1)
})


const app = express()
const PORT = config.PORT || 8080

const DIFFICULTY = 3

app.use(cors())
app.use(express.json())

app.post("/addblock", (req, res) => {
    console.log(`POST: /addblock, PORT: ${req.body.nodeHash}`)
    config.BCLK = new CryptBlockchain(id=config.PACK_ID, req.body.blockchain.blockchain)
    console.log(config.BCLK)
    res.status(200).send("OK")
})

app.get("/", (req, res) => {
    console.log("GET: /")

    res.send(JSON.stringify(trackerBlockchain))
})

app.post("/verify", (req, res) => {
    let block = new CryptBlock(req.body.date, req.body.data, req.body.reqPORT, req.body.nodeHash, req.body.index, 0)
    let hash= SHA256(this.index + req.body.date + JSON.stringify(req.body.date) + req.body.PORT + config.BCLK.obtainLatestBlock().prevHash + 0).toString()
    block.proofOfWork()
    //console.log(block)
    res.status(200).json({nonce: block.nonce})
})

app.post("/end", (req, res) => {
    res.status(200).send("OK")
    process.exit(0)
})

app.get("/get", (req, res) => res.status(200).json({data: "nodePORTS[req.body.PORT]", blockchain: config.BCLK}))

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))