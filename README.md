This is a [Next.js](https://nextjs.org/) project

Website here: [Money Pool](https://money.jordanstoneportfolio.com)

# Money Pools

<h2>Description</h2>

Money Pools is a blockchain app currently working on the Goerli Ethereum test network. The app allows users to create a contract (a Money Pool). In the money pool the creator sets which wallet addresses they would like to add to the pool and set a target amount for the pool to raise. In the final version this app is meant to serve as a place to make group bets ie. bet for fantasy football or on big event like the super bowl. Until I find a good Oracle to get the decentralized sports data from, it will pick a user at random when the button is clicked. The winner is picked from the list of invited users and will be the total amount that has been added to the money pool.


<h2>Build Instructions</h2>

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
<h2>User Guide</h2>
<ol>
<li>Download Metamask browser extension</li>
<li>Create a Metamask account</li>
<li>In Metamask account switch to the Goerli network</li>
<li>Get free Goerli Tokens: <a>https://goerlifaucet.com</a> </li> 
<li>Click "Get Pools" button on web app to see the currently deployed contracts</li>
<li>Create a new contract by filling in the form with the address you want to invite (including your own wallet address if you want to be added)</li>
<li>Set a target amount</li>
<li>Set a name for the money pool</li>
<li>When you click submit you'll receive a request in your metamask wallet for the gas fee for the new contract. This is on the test network so you will not be spending real money. </li>
<li>After a couple minutes you should see a notification in the browser saying the transaction is complete then you'll receive another request to cover the gas of adding your new money pool to the list of all money pools </li>
<li>After another few minutes click "Get Pools" again to see your new money pool on the page. </li>
</ol>
