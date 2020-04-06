const express = require('express')
const bodyParser = require('body-parser')
const ngrok = require('ngrok')
const decodeJWT = require('did-jwt').decodeJWT
const { Credentials } = require('uport-credentials')
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util
var { send } = require('./push')

let endpoint = ''
const app = express();
app.use(bodyParser.json({ type: '*/*' }))

const RPC_URL = "https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c";
//setup Credentials object with newly created application identity.
const credentials = new Credentials({
    appName: 'Gorilla Login Example',
      did: 'did:ethr:0x136dd005fa469e33581b9623ad82b2c8f42bc9d2',
      privateKey: 'f161a002a08b6fc9c6f54b6a0dc9b4622e32fa5a4821a440f0e7761f5880efd0',
      ethrConfig: {
        rpcUrl: RPC_URL //<--- Required Upgrade to uport-credentials@1.3.0
      }
})

// Selective Disclosure Request
app.get('/', (req, res) => {
    //Create a new disclosure request, requesting the push notification token and a new key
    credentials.createDisclosureRequest({
      notifications: true,
      accountType: 'keypair',
      vc: ['/ipfs/QmWE2pDhzcaa6jN1YQCgisBtBqF5uUCeQrfVAvGqoX4BEx'],
      callbackUrl: endpoint + '/callback'
    }).then(disclosureRequestJWT => {
      console.log('get:',decodeJWT(disclosureRequestJWT))  //log request token to console
      
      //Create QR code with the disclosure request.
      const uri = message.paramsToQueryString(message.messageToURI(disclosureRequestJWT), {callback_type: 'post'})
      const qr =  transports.ui.getImageDataURI(uri)
      res.send(`<div><img src="${qr}"/></div>`)
    })
})

// Disclosure Response Authentication Service
// after scan QR
app.post('/callback', (req, res) => {
    const access_token = req.body.access_token
    credentials.authenticateDisclosureResponse(access_token).then(userProfile => {
      console.log('callback:',{userProfile}, "\n\n")
  
      const attestation = {
        sub: userProfile.did,
        claim: { 
          gorillaKYC:{
            name: 'Test User', 
            dni: '1234567-8',
            kyc: 'passed'
          }
        }
      }
  
      credentials.createVerification(attestation)
      .then( credential => {
        //Push credential to user
        const pushTransport = transports.push.send(userProfile.pushToken, userProfile.boxPub)
        return pushTransport(credential)
      })
      .then(pushData => {
        console.log("Pushed to user: "+JSON.stringify(pushData))
        
      })

      // https://github.com/uport-project/text-push-example

      const message = {
        sub: userProfile.did,
        type: 'info',
        title: "Onfido haven't been able to issue your Onfido ID",
        body: "As this service is still in beta, we don't have troubleshooting support yet, but do read our FAQs for more information.",
        ctaUrl: 'http://www.onfido.com/',
        ctaTitle: 'Go to FAQs',
        // vc: ['/ipfs/QmZ9PEntS99Mf74ZQspgAwR3WasNzL4HuAUUMN9VEopPPP'],
      }
      const push = send(userProfile.pushToken, userProfile.boxPub)
      credentials.signJWT(message).then(attestation => {
        console.log(`Encoded JWT sent to user: ${attestation}`)
        console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`)
        return push(attestation,
          {alert: "Onfido haven't been able to issue your Onfido ID"}
        )  // *push* the notification to the user's uPort mobile app.
      }).then(res => {
        console.log(res)
        console.log('Push notification sent and should be recieved any moment...')
        console.log('Accept the push notification in the uPort mobile application')
        // ngrok.disconnect()
      })
  
    })
})

// run the app server and tunneling service
app.listen(8888, () => {
    ngrok.connect(8888).then(ngrokUrl => {
      endpoint = ngrokUrl
      console.log(`Login Service running, open at ${endpoint}`)
    }).catch(error => console.error(error))
})