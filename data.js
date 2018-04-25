var time = require('time');
 
// Create a new Date instance, representing the current instant in time 

var now = new time.Date();
 
now.setTimezone("America/New_York");

const crypto = require('crypto')
const request = require('request')

// Ask API keys to OptiTeam
const apiKey = ''
const apiSecret = ''

const apiPath = 'v2/auth/r/wallets'
const nonce = Date.now().toString()
const body = {}
const rawBody = JSON.stringify(body)
let signature = `/api/${apiPath}${nonce}${rawBody}`

signature = crypto
  .createHmac('sha384', apiSecret)
  .update(signature)
  .digest('hex')

const options = {
  url: `https://api.bitfinex.com/${apiPath}`,
  headers: {
    'bfx-nonce': nonce,
    'bfx-apikey': apiKey,
    'bfx-signature': signature
  },
  body: body,
  json: true
}


request.post(options, (error, response, body) => {

	console.log(body);

	var myArray = body;

	myArray.forEach(function(body){

		var code = body[1];
		var amount = body[2];
		var type = body[0];
		var total_usd = total_usd + amount;

		const options = {
		  	url: 'https://api.bitfinex.com/v2/tickers?symbols=t' + code + 'USD',
		  	method: 'GET',
		  	json: true
		}


		request.get(options, (error, response, body) => {

			var myNewArray = [].concat.apply([], body);
			var price = myNewArray[1];
			var value = amount * price;
			console.log(code + ' - Amount: ' + amount + ' Price: '  + price + ' Value USD: ' + value + ' Type: ' + type + ' / ' + body)
		});

		

			const options_btc = {
		  	url: 'https://api.bitfinex.com/v2/tickers?symbols=t' + code + 'BTC',
		  	method: 'GET',
		  	json: true
		}

		request.get(options_btc, (error, response, body) => {

			var myNewArray_btc = [].concat.apply([], body);
			var price_btc = myNewArray_btc[1];
			var value_btc = amount * price_btc;
			var total_usd = total_usd + amount;
			console.log(code + ' - Amount: ' + amount + ' Price: '  + price_btc + ' Value BTC: ' + value_btc + ' Type: ' + type)
		});

	}); 

});
