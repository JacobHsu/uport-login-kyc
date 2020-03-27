# uport-login-kyc

`$ yarn add express body-parser ngrok`
`$ yarn add did-jwt uport-credentials uport-transports`

[disclosure-request-login-service](https://developer.uport.me/credentials/login#disclosure-request-login-service)

![Alt server-login](https://developer.uport.me/static/ac1d5b0471fb8a825c4eb9f6b81db294/7a2d1/server-login.png)

## sample

/uportlandia/stage/issuers

```json
{
"CITY_ID":{"did":"did:ethr:0x8bb183661b5a34de9b9335121cd6d52dda36891d","key":"e7c670843c016850d4ae3f20276e73755a6c91a2f6046abcef55f0fe42a3533e","vc":["/ipfs/QmXLhSxiQt89kY9mnWUPAZYna1a51jmqLVPf6iN4TGdJK1"]
}
```

https://uportlandia.uport.space/city/ipfs/QmXLhSxiQt89kY9mnWUPAZYna1a51jmqLVPf6iN4TGdJK1

## fix yarn setup

>  Error: EthrDIDResolver requires a provider configuration for at least one network

node_scripts\create_issuers.js

```js
// https://github.com/uport-project/uport-credentials#uport-credentials-library
const RPC_URL = "https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c";

const credentials = new Credentials({
    appName: 'Gorilla Login Example',
      did: 'did:ethr:0x136dd005fa469e33581b9623ad82b2c8f42bc9d2',
      privateKey: 'f161a002a08b6fc9c6f54b6a0dc9b4622e32fa5a4821a440f0e7761f5880efd0',
      ethrConfig: {
        rpcUrl: RPC_URL //<--- Required Upgrade to uport-credentials@1.3.0
      }
})
```

## References

[ngrok](https://ngrok.com/product) exposes local servers behind NATs and firewalls to the public internet over secure tunnels.
