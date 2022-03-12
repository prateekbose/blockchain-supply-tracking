const express = require('express')
const cors = require('cors')
const SHA256 = require('crypto-js/sha256')

const app = express()
const PORT = process.env.PORT || 8080

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
    }

    computeHash(){
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.customerHas + this.prevHash).toString()
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
        newBlock.hash = newBlock.computeHash()
        this.blockchain.push(newBlock)
    }

    checkChainValidity(){
        
    }
}

let trackerBlockchain = new CryptBlockchain();

app.post("/addblock", (req, res) => {
    const data = req.body
    console.log(Object.keys(data))
    trackerBlockchain.addNewBlock(new CryptBlock(data["date"], data["data"] , data["userHash"]));
    console.log(JSON.stringify(trackerBlockchain.obtainLatestBlock(), null, 4));

    res.send(JSON.stringify(trackerBlockchain.obtainLatestBlock()))
})

app.get("/", (req, res) => {
    res.send(JSON.stringify(trackerBlockchain))
})




app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))