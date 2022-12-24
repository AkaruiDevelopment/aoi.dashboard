const { Utils } = require("./utils.js");
const fs = require("fs");
const path = require("path");
const express = require("express");
const session = require('express-session');





class Dash {
  constructor(args){
    this.args = args;
    console.log("\x1b[32m%s\x1b[0m", "Initializing @akarui/aoi.dashboard.")

    
    if(!args.redirectUri) {
      console.log("\x1b[31m%s\x1b[0m","[@akarui/aoi.dashboard Error:] redirectUri not provided! Exiting Code!");
      process.exit(0);
    }
    if(!args.clientId) {
      console.log("\x1b[31m%s\x1b[0m","[@akarui/aoi.dashboard Error:] clientId not provided! Exiting Code!");
      process.exit(0);
    }
    if(!args.clientSecret) {
      console.log("\x1b[31m%s\x1b[0m","[@akarui/aoi.dashboard Error:] clientSecret not provided! Exiting Code! [Note: You can get it from discord's dev portal!]");
      process.exit(0);
    }
    if(!args.bot) {
      console.log("\x1b[31m%s\x1b[0m","[@akarui/aoi.dashboard Error:] bot object [aoi client || djs client] not provided! Exiting Code!");
      process.exit(0);
    }

    const utils = new Utils({
      bot:args.bot,
      clientSecret:args.clientSecret,
      clientId:args.clientId,
      redirectUri:args.redirectUri
    })

    this.utils = utils
  
  }
  createDash(args){
    if(!args.port){console.log("\x1b[31m%s\x1b[0m","[@akarui/aoi.dashboard Error:] port not provided! Taking Default as 3000");args.port=3000}
    const app = express();
    app.listen(args.port, () => {
      console.log("\x1b[32m%s\x1b[0m", "Dashboard listening on port: " + args.port);
    });
    app.use(session({ secret: require("crypto").randomBytes(12).toString("hex"), cookie: { maxAge: 86400000 }}))
    this.app = app;
  }
  newPage(args){
    if(!args.uri||!args.file){
      console.log("\x1b[31m%s\x1b[0m","[@akarui/aoi.dashboard Error:] uri/file not provided..."); process.exit(0);
    }
    if(args.type=="auth"){
      return this.app.get(args.uri, async (req, res) => {
        let code=req.query.code;
        let data = await this.utils.getAccessToken(code);
        req.session.access_token = data;
        
        return res.redirect(args.file);
      })
    }
    console.log(path.join(process.cwd()+args.file))
    const file = fs.readFileSync(path.join(process.cwd()+args.file));
    const html = file.toString();
    this.app.get(args.uri, (req, res) => {
      res.send(html.replace("{url}",this.utils.generateUrl()));
    })
  }
}

module.exports = {
  Dash
}