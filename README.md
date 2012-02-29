TALK
====

**TALK** is a simple FOSS node.js app for creating private chats.

You can test it live here: <http://talk.nodester.com/>.

Features
--------

- Create private chats with a custom password and share it with a simple url (talk.nodester.com/chatname)

- Avoid relying on obscure servers (&hearts; *nodester*).

- Post comments using the Markdown Syntax.

- Load comments manually by default (for mobile and unstable connections), with an option to ask for new comments automatically every second (for stable connections).

- No way to store the chats in disks or databases, we don't want that.


Installation
------------

Install all the dependencies with `npm`

    npm install

Then run **TALK** main server file with `node`

    node server.js

And finally open <http://localhost:14774/> on your browser.
