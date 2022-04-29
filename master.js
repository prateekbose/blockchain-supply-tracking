const express = require('express')
const cors = require('cors')
const SHA256 = require('crypto-js/sha256')
const prompt = require('prompt-sync')()
const crypto = require('crypto')
const sqlite3 = require('sqlite3')
const chalk = require('chalk')
const fs = require('fs')

const CryptBlockchain = require('./CryptBlockchain')
const CryptBlock = require('./CryptBlock')
const { default: axios } = require('axios')

const db = new sqlite3.Database('./cred.db')

var config = {
    packageID: prompt("Enter Package ID: ")
}

var nodePORTS = {}

const app = express()
const PORT = 8080

app.use(cors())
app.use(express.json())

let trackerBlockchain = new CryptBlockchain(id=config.packageID)
console.log(trackerBlockchain.obtainLatestBlock().hash)


app.post("/register", (req, res) => {
    console.log(`${chalk.yellow("POST")}: /register, HOST: ${chalk.blue(req.body["PORT"])}`)
    const userName = req.body["user"]
    const userPass = req.body["pass"]

    db.get(`SELECT pass FROM nodecred WHERE user='${userName}'`, (err, row) => {
        if(!row || err) res.status(400).send("Error")
        else {
            if(row.pass == userPass){
                nodePORTS[req.body["PORT"]] = SHA256(req.body["PORT"]).toString()
                console.log(`${chalk.green("Node Count")}: ${Object.keys(nodePORTS).length}, [${Object.keys(nodePORTS)}], nodeHash: ${nodePORTS[req.body["PORT"]]}`)
                res.status(200).json({key: nodePORTS[req.body["PORT"]], blockchain: trackerBlockchain})
            } else {
                res.status(401).send("Invalid Credentials")
            }
        }
    })
})

app.get("/get", (req, res) => res.status(200).json({data: "nodePORTS[req.body.PORT]", blockchain: trackerBlockchain}))

app.post("/add", (req, res) => {
    console.log(`POST: /add, PORT: ${req.body["PORT"]}`)
    const reqPORT = req.body["PORT"]
    let block = new CryptBlock(Date.now(), req.body.data, req.body.PORT, trackerBlockchain.obtainLatestBlock().hash, trackerBlockchain.length(), 0)
    block.proofOfWork()
    if( req.body.id == config.packageID ){
        let add = false
        //console.log(block.hash)
        if(Object.keys(nodePORTS).length > 1){
            Object.keys(nodePORTS).forEach((port) => {
                if(port != req.body["PORT"] && !add)
                axios
                    .post(`http://localhost:${port}/verify`, {
                        date: Date.now(), 
                        data: req.body.data, 
                        reqPORT: reqPORT, 
                        nodeHash: trackerBlockchain.obtainLatestBlock().hash, 
                        index: trackerBlockchain.length()
                    })
                    .then(res => {
                        add = (block.nonce == res.data.nonce)
                    })
                    .catch(err => console.error(err))
                })
            }
            if(req.body.hash == trackerBlockchain.obtainLatestBlock().hash) add = true
            if(add && block.data == "Delivered"){
                let count = 0
                Object.keys(nodePORTS).forEach((port) => {
                    axios
                        .post(`http://localhost:${port}/end`)
                        .then(res => count++)
                        .catch(err => console.error(err))
                })
                save()
                if(count == Object.keys(nodePORTS).length) console.log(chalk.red("All Nodes Deregistered Succesfully"))
                res.status(200).send("OK")
                process.exit(0)
            }
            if(add){
                console.log('Adding Block')
                trackerBlockchain.addNewBlock(block)
                Object.keys(nodePORTS).forEach((port) => {
                    axios
                        .post(`http://localhost:${port}/addblock`, {
                            blockchain: trackerBlockchain,
                            nodeHash: req.body["PORT"]
                        })
                        .then(res => {})
                        .catch(err => console.error(err))
                })
            console.log(trackerBlockchain.blockchain)
        }
        res.status(200).send("OK")
    } else res.status(400).send("Invalid Package ID")
})

const save = () => {
    fs.writeFileSync('blockchain.json', JSON.stringify(trackerBlockchain))
}

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))