var DEV_MODE = true;
var MATIC_DAGGER = DEV_MODE ? "wss://matic.dagger2.matic.network" : "wss://mainnet.dagger.matic.network";
var satoshi = 100000000;
var wei = 10000000000000000000; // 10^18

// var donationAddress = "0xf7050c2908b6c1ccdfb2a44b87853bcc3345e3b3";
var DELAY_CAP = 20000;
var lastBlockHeight = 0;

var provider_name = "blockchain.info";

var transactionSocketDelay = 1000;

/** @constructor */
function TransactionSocket() {

}

TransactionSocket.init = function() {
	// Terminate previous connection, if any
	if (TransactionSocket.connection)
		TransactionSocket.connection.close();

	if ('WebSocket' in window) {
		colsole.log("Hello Im here");
		var connection = new ReconnectingWebSocket('wss://mainnet.dagger.matic.network');
		console.log(MATIC_DAGGER);
		var dagger = new Dagger(MATIC_DAGGER); // dagger server data retrival here
		TransactionSocket.connection = connection;

		StatusBox.reconnecting("blockchain");

		connection.onopen = function() {
			console.log('Blockchain.info: Connection open!');
			StatusBox.connected("blockchain");
			var newTransactions = {
				"op" : "unconfirmed_sub"
			};
			var newBlocks = {
				"op" : "blocks_sub"
			};
			connection.send(JSON.stringify(newTransactions));
			connection.send(JSON.stringify(newBlocks));
			connection.send(JSON.stringify({
				"op" : "ping_tx"
			}));
			// Display the latest transaction so the user sees something.
		};

		connection.onclose = function() {
			console.log('Blockchain.info: Connection closed');
			if ($("#blockchainCheckBox").prop("checked"))
				StatusBox.reconnecting("blockchain");
			else
				StatusBox.closed("blockchain");
		};

		connection.onerror = function(error) {
			console.log('Blockchain.info: Connection Error: ' + error);
		};
		
		// dagger.on("latest:tx/+", function(data) {
		dagger.on("latest:tx/"+ donationAddress, function(data) {
			console.log("===========================");
			console.log("New block created: ", data);
			// debugger;
			// var data = JSON.parse(data);
			var ethereum = data.value / wei;
			console.log("Data value: " + data.value);
			console.log("ETH value : " + ethereum);
			console.log("===========================");
			
			new Transaction(ethereum);
			return;
		});

		connection.onmessage = function(e) {
			
			var data = JSON.parse(e);
			console.log(data);
			
			if (data.op == "no_data") {
			    TransactionSocket.close();
			    setTimeout(TransactionSocket.init, transactionSocketDelay);
			    transactionSocketDelay *= 2;
				console.log("connection borked, reconnecting");
			}

			// New Transaction
			if (data.op == "utx") {
				var transacted = 0;

				for (var i = 0; i < data.x.out.length; i++) {
					transacted += data.x.out[i].value;
				}

				var bitcoins = transacted / satoshi;
				//console.log("Transaction: " + bitcoins + " BTC");

				var donation = false;
                                var soundDonation = false;
				var outputs = data.x.out;
				for (var j = 0; j < outputs.length; j++) {
					if ((outputs[j].addr) == DONATION_ADDRESS) {
						bitcoins = data.x.out[j].value / satoshi;
						new Transaction(bitcoins, true);
						return;
					}
				}

                if (transaction_count === 0) {
                    new Transaction(bitcoins);
                } else {
				    setTimeout(function() {
					    new Transaction(bitcoins);
				    }, Math.random() * DELAY_CAP);
				}

			} else if (data.op == "block") {
				var blockHeight = data.x.height;
				var transactions = data.x.nTx;
				var volumeSent = data.x.estimatedBTCSent;
				var blockSize = data.x.size;
				// Filter out the orphaned blocks.
				if (blockHeight > lastBlockHeight) {
					lastBlockHeight = blockHeight;
					console.log("New Block");
					new Block(blockHeight, transactions, volumeSent, blockSize);
				}
			}

		};
	} else {
		//WebSockets are not supported.
		console.log("No websocket support.");
		StatusBox.nosupport("blockchain");
	}
};

TransactionSocket.close = function() {
	if (TransactionSocket.connection)
		TransactionSocket.connection.close();
	StatusBox.closed("blockchain");
};
