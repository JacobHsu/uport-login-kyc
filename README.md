# uport-login-kyc

`$ yarn add express body-parser ngrok`  
`$ yarn add did-jwt uport-credentials uport-transports`  

generate-vc.js `Verified Claims`  
`$ yarn add axios form-data`

[disclosure-request-login-service](https://developer.uport.me/credentials/login#disclosure-request-login-service)

![Alt server-login](https://developer.uport.me/static/ac1d5b0471fb8a825c4eb9f6b81db294/7a2d1/server-login.png)

## Usage

`$ yarn start`

`$ yarn id` node create-identity.js  
create the application identity that will be used to sign requests:

`$ yarn vc`  node generate-vc.js  
Add this to your uport requests: vc: ['/ipfs/QmWRcNoU1qdkPE49eT13MdZsLCfxPhVKLvdoG9Z6etmefN']

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

## Note

[JWT 的原理](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)是，服務器認證以後，生成一個 JSON 對象，發回給用戶

```json
{
  "姓名": "張三",
  "角色": "管理員",
  "到期時間": "2020年7月1日0點0分"
}
```

用戶與服務端通信的時候，都要發回這個 JSON 對象。服務器完全只靠這個對象認定用戶身份。為了防止用戶篡改數據，服務器在生成這個對象的時候，會加上簽名（詳見後文）。

服務器就不保存任何 session 數據了，也就是說，服務器變成無狀態了，從而比較容易實現擴展。

JWT 的最大缺點是，由於服務器不保存 session 狀態，因此無法在使用過程中廢止某個 token，或者更改 token 的權限。也就是說，一旦 JWT 簽發了，在到期之前就會始終有效，除非服務器部署額外的邏輯。

JWT 默認是不加密，為了減少盜用，JWT 不應該使用 HTTP 協議明碼傳輸，要使用 HTTPS 協議傳輸。

[JSON Web Token(JWT) 簡單介紹](https://mgleon08.github.io/blog/2018/07/16/jwt/)
iss (Issuer) - jwt簽發者 The DID of the signing identity  
sub (Subject) - jwt所面向的用戶 The DID of the subject identity  

[createverification](https://developer.uport.me/credentials/createverification) [Verified Claims](https://developer.uport.me/messages/verification) 已驗證的聲明

`vc` Array of Verified Claims JWTs or IPFS hash of JSON encoded equivalent about the `iss` of this message


###　JWT 的使用方式

客戶端收到服務器返回的 JWT，可以儲存在 Cookie 裡面，也可以儲存在 localStorage。

此後，客戶端每次與服務器通信，都要帶上這個 JWT。你可以把它放在 Cookie 裡面自動發送，但是這樣不能跨域，所以更好的做法是放在 HTTP 請求的頭信息Authorization字段裡面。

`Authorization: Bearer <token>`

## References

[ngrok](https://ngrok.com/product) exposes local servers behind NATs and firewalls to the public internet over secure tunnels.
[text-push-example](https://github.com/uport-project/text-push-example)