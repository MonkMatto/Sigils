const PLEDGEcontract = new web3.eth.Contract(PLEDGE_ABI, PLEDGE_ADDRESS);
const SIGILScontract = new web3.eth.Contract(SIGILS_ABI, SIGILS_ADDRESS);
let error, circulation, locked, amount, denomination;

// update contract link in html header
let explorerDomain = mainnet ? "etherscan.io" : "sepolia.etherscan.io";
document.getElementById(
  "sigils-contract-link"
).innerHTML = `<a href="https://${explorerDomain}/address/${SIGILS_ADDRESS}#code" target="_blank">Contract</a>`;

document.getElementById("pledge-contract-link").innerHTML = `<a
  href="https://${explorerDomain}/address/${PLEDGE_ADDRESS}#writeContract"
  target="_blank"
>Etherscan</a>`;

// Call the function to check the network and if a wallet is connected
checkNetworkAndWallet();

async function checkNetworkAndWallet() {
  // First, check if window.ethereum is available (e.g., MetaMask or other web3 provider)
  if (window.ethereum) {
    // Create a new instance of Web3 using window.ethereum as the provider
    const web3 = new Web3(window.ethereum);
    try {
      const accounts = await web3.eth.getAccounts();
      const networkType = await web3.eth.net.getNetworkType();
      if (networkType != 'main') {
        document.getElementById('network-name').innerHTML = `<p style="text-align:center"><em>Please switch to Main network</em></p>`;
      } 
      // document.getElementById('network-name').innerHTML = `<p style="text-align:center">Current network: Main.</p>`;
      if (accounts.length > 0) {
        document.getElementById('connect-button').style.display = "none";
        document.getElementById('connect-approve-anchor-reveal').style.display = "block";
      } else {
        document.getElementById('connect-button').style.display = "block";
        document.getElementById(
          "connect-approve-anchor-reveal"
        ).style.display = "none";
      }
      
    } catch (error) {
      console.error("Error getting accounts or network type:", error);
    }
  } else {
    console.log("Ethereum provider not available.");
  }
}

async function updateStats() {
  console.log("Attempting to update statistics");
  try {
    circulation = await SIGILScontract.methods.totalSupply().call({
    }, function(err, res) {
      if (err) {
        console.log(err);
        return
      }
    });
  } catch (errorMessage) {
    error = true;
  }
  if (error) {
    console.log("Circulation was not retrieved");
  } else {
    circulation = Number(circulation).toLocaleString()
    console.log("Circulation: " + circulation);
    document.getElementById("circulation").innerHTML = `<h6>${circulation}</h6>`;
    locked = circulation * 2500;
    console.log("Locked: " + locked);
    document.getElementById("locked").innerHTML = `<h6>${locked}</h6>`;
    if (circulation > 0) {
      document.getElementById(
        "contract-interaction-placeholder"
      ).style.display = "none";
      document.getElementById("contract-interactions").style.display = "block";
      document.getElementById("rift-status").innerHTML = `<p>The rift pulses with magical energy!</p>`;
    }
  }
}

async function approve() {
  console.log("Attempting to approve ERC-20");
  amount = parseInt(document.getElementById('approved-amount').value);
  console.log(amount);
  amount = BigInt(amount * 10**18);
  console.log(amount);
  try {
    circulation = await PLEDGEcontract.methods.approve(SIGILS_ADDRESS, amount).send({
        from: currentAccount
    }, function(err, res) {
      if (err) {
        console.log(err);
        return
      }
    });
  } catch (errorMessage) {
    error = true;
  }
  if (error) {
    console.log("Approval was not successfull");
  } else {
    console.log("Approval sent");
  }
}

async function checkAllowance() {
  console.log("Attempting to check approvals");
  try {
    amount = await PLEDGEcontract.methods.allowance(currentAccount, SIGILS_ADDRESS).call({
    }, function(err, res) {
      if (err) {
        console.log(err);
        return
      }
    });
  } catch (errorMessage) {
    error = true;
  }
  if (error) {
    console.log("Allowance was not retrieved");
  } else {
    amount = Number(amount / 10**18).toLocaleString();
    console.log(`Allowance: ${amount}`);
    document.getElementById('allowance').innerHTML = `<p>Allowance is set to <strong>${amount}</strong> $PLEDGE.</p>`;
  }
}

async function SUMMON() {
  console.log("Attempting to Summon a Guardian Sigil");
  tokenRecipient = document.getElementById('token-recipient').value;
  console.log(`Summoning to: ${tokenRecipient}`);
  try {
    await SIGILScontract.methods.SUMMON(tokenRecipient).send({
        from: currentAccount
    }, function(err, res) {
      if (err) {
        console.log(err);
        return
      }
    });
  } catch (errorMessage) {
    error = true;
  }
  if (error) {
    console.log("Summoning was not successfull");
  } else {
    console.log("Summoning Successful");
  }
}

async function SACRIFICE() {
  console.log("Attempting to Sacrifice a token");
  tokeToSacrifice = document.getElementById('token-to-sacrifice').value;
  console.log(`Sacrificing: ${tokeToSacrifice}`);
  try {
    await SIGILScontract.methods.SACRIFICE(tokeToSacrifice).send(
      {
        from: currentAccount,
      },
      function (err, res) {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  } catch (errorMessage) {
    error = true;
  }
  if (error) {
    console.log("Sacrifice was not successfull");
  } else {
    console.log("Sacrifice Successful");
  }
}
