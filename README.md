# Supply Chain Tracking using Blockchain
Blockchain can provide a permanent, shareable, changeable record of products in an effective way. The potential expectation with the blockchain technology for the case of supply chain of a certain logistics will be implemented. Blockchain can provide increased supply chain transparency, as well as reduced cost and risk across the supply chain. Hence proposed a tokenless blockchain based method to track package updates across the supply chain.

Since there is no need for transactions between the nodes, dropping token based approach reduces computational overhead from the network.

## Features
1. Tokenless Blockchain
2. Highly scalable
3. Increased security by consensus
4. Security improves as new nodes join the network

## Technologies Used
| Technologies | Usage                                                               |
|--------------|---------------------------------------------------------------------|
| Node.js      | For creating the REST API for the Nodes (Master and Archive Nodes)  |
| Axios        | Sending Requests between Master and Archive Nodes                   |
| Crypt-js     | For computing hashes and Encryption                                 |
| SQLite3      | For utilizing SQLite DB to verify and authenticate Node credentials |
| NoSQL        | For dumping final Blockchain state, when the package is delivered   |

