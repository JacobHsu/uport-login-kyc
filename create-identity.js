// https://developer.uport.me/credentials/login Setup
const { Credentials } = require('uport-credentials')
console.log(Credentials.createIdentity())

// Output:
// { 
//   did: 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e',
//   privateKey: 'ef6a01d0d98ba08bd23ee8b0c650076c65d629560940de9935d0f46f00679e01' 
// }