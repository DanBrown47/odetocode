## Ethilizer ##
Ethilizer is a realtime Ethereum transaction visualizer. With this, we can see new Ethereum transactions as they propagate through the Ethereum Network. This Project is inspired by bitlistner.com or formaly Bitcoin Listner

Ethilizer is written in HTML/Javascript using the Matic eth-dagger websocket API.

### Building ###

1. [Install Node.js](https://nodejs.org/download/).host it at http://localhost:8000, and watch for and rebuild changes in the source files.

2. Install grunt-cli using `sudo npm install -g grunt-cli`.

2. Cd into the project directory and run `npm install` to install the proper Grunt version and dependencies.

3. Run `grunt` to build Ethilizer. Alternatively, run `grunt watch`. 

### APIs and Libraries ###

Ethereum uses these libraries:

* [Howler.js](http://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library) by James Simpson
* [Reconnecting-Websocket](https://github.com/joewalnes/reconnecting-websocket) by Joe Walnes

Ethereum uses these APIs:

* [Matic Eth-Dagger](https://matic.network/dagger) WebSocket API (For Transactions)

### Reference & License ###
This project is adapted from [BitListen](https://github.com/MaxLaumeister/bitlisten). If you distribute this project in part or in full, please attribute with a link to [the GitHub page](https://github.com/MaxLaumeister/bitlisten). This software is available under the MIT License, details in the included `LICENSE.md` file. 
