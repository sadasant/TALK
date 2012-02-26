# TALK

**TALK** is a simple web system for creating private chats aimed to be the simpliest way to chat over slow and unstable network connections.

**TALK** is written in Node.js using Express, Jade, Stylus and Node-markdown.

*Test it live here: <http://talk.nodester.com/>*

### Features

- Create private chats with a custom password and share it with a simple url (talk.nodester.com/chatname)

- Avoid relying on obscure servers (&hearts; *nodester*).

- Post comments using the Markdown Syntax.

- Load comments manually by default (for mobile and unstable connections), with an option to ask for new comments automatically every second (for stable connections).

- No way to store the chats in disks or databases, we don't want that.

### How to install

- Download and uncompress the [source code](https://github.com/sadasant/TALK/zipball/master).

- I assume you have Node.js and NPM, so enter the folder and run `npm install` to automatically install all the dependencies.

- Run **TALK** with `node server.js` and it will be ready to use on <http://localhost:14774/>

  

*Author: [Daniel R.](http://sadasant.com/)*

*License: [MIT](http://opensource.org/licenses/mit-license.php)*
