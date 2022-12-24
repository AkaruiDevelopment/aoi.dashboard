# dashboard
Upcoming project.
Current Usage
```js
const { Bot } = require("aoi.js")
const { Dash } = require("./src/dash.js");
const dashBot = new Bot({
  token:process.env["token"],
  prefix:["$getServerVar[prefix]","!"],
  intents:["GUILDS","GUILD_MESSAGES"]
})
dashBot.onMessage();
dashBot.variables({
  prefix:"!"
})
var dash =new Dash({
  clientId:"998432959021461615",//CLIENT ID
  clientSecret:process.env.sec,//CLIENT SECRET
  bot:dashBot,//YOUR AOI CLIENT
  redirectUri:"https://example.com/redirect"//AUTH REDIRECT PAGE
})

dash.createDash({port:3000})

dash.newPage({
  uri:"/",
  file:"/pages/index.html"
})

dash.newPage({
  uri:"/redirect",
  type:"auth",
  file:"/dash"
})
```