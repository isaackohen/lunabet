const http = require('http');
const Web3 = require('web3'), web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9546'));

let latestBlockChecked;

async function checkLastBlock() {
    let block = await web3.eth.getBlock('latest');
    if(latestBlockChecked === block.number) return;
    latestBlockChecked = block.number;

    console.log(`Searching block ${block.number}`);
    if(block && block.transactions) {
        for(let txHash of block.transactions) {
            http.get(`http://localhost/api/walletNotify/eth/${txHash}`).on('error', console.log);
        }
    }
}

setInterval(checkLastBlock, 1000);

web3.eth.getAccounts().then(console.log);
