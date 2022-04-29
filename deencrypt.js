const crypto = require('crypto')
const algorithm = 'aes-256-cbc'

function encrypt(text, key) {
    console.log(key)
    let cipher = crypto.createCipheriv('aes-256-cbc', key, key)
    let encrypted = cipher.update(text, "utf-8", "hex")
    encrypted += cipher.final("hex")
    return encrypted.toString()
 }

function decrypt(text, key) {
   let decipher = crypto.createDecipheriv('aes-256-cbc', key, key)
   let decrypted = decipher.update(text)
   decrypted += decipher.final("utf-8")
   return decrypted.toString()
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}