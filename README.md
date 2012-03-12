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

License
------------

Copyright (c) 2012 Daniel Rodríguez (http://sadasant.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
