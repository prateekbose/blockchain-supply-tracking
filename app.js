const express = require('express')
const cors = require('cors')
const SHA256 = require('crypto-js/sha256')

const app = express()
const PORT = process.env.PORT || 8080

const DIFFICULTY = 10

app.use(cors())
app.use(express.json())

class CryptBlock{
    constructor(timestamp, data, customerHash, prevHash = "", index = 0){
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.customerHash = SHA256(customerHash).toString()
        this.prevHash = prevHash
        this.hash = this.computeHash()
        this.nonce = 0
    }    

    proofOfWork(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("")){
            this.nonce++
            this.hash = this.computeHash()
        }
    }

    computeHash(){
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.customerHas + this.prevHash + this.nonce).toString()
    }
}

class CryptBlockchain{
    constructor(){
        this.blockchain = [this.startGenesisBlock()]
        this.size = 1
    }

    startGenesisBlock(){
        return new CryptBlock(0, "04/03/2022", "Block 0: init", "100", "0")
    }

    obtainLatestBlock(){
        return this.blockchain[this.blockchain.length - 1]
    }

    addNewBlock(newBlock){
        newBlock.index = this.size++
        newBlock.prevHash = this.obtainLatestBlock().hash
        // newBlock.hash = newBlock.computeHash()
        newBlock.proofOfWork(DIFFICULTY)
        this.blockchain.push(newBlock)
    }

    checkChainValidity(){
        for(let i=1;i<this.size;i++){
            const curr = this.blockchain[i];
            const pred = this.blockchain[i-1];

            if(curr.hash !== curr.computeHash()) return false

            if(curr.prevHash !== pred.hash) return false
        }

        return true
    }
}

let trackerBlockchain = new CryptBlockchain();

app.post("/addblock", (req, res) => {
    console.log("POST: /addblock")
    
    const data = req.body
    trackerBlockchain.addNewBlock(new CryptBlock(data["date"], data["data"] , data["userHash"]));
    console.log(JSON.stringify(trackerBlockchain.obtainLatestBlock(), null, 4));

    res.send(JSON.stringify(trackerBlockchain.obtainLatestBlock()))
})

app.get("/", (req, res) => {
    console.log("GET: /")

    res.send(JSON.stringify(trackerBlockchain))
})




app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))