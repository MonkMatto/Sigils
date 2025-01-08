let mainnet = false;
let PLEDGE_ADDRESS, SIGILS_ADDRESS;
if (mainnet) {
  PLEDGE_ADDRESS = "0x910812c44eD2a3B611E4b051d9D83A88d652E2DD";
  SIGILS_ADDRESS = "";
} else { // sepolia
  PLEDGE_ADDRESS = "0x37538D1201486e11f5A06779168a30bA9D683a12";
  SIGILS_ADDRESS = "";
}
const PLEDGEcontract = new web3.eth.Contract(PLEDGE_ABI, PLEDGE_ADDRESS);
const SIGILScontract = new web3.eth.Contract(SIGILS_ABI, SIGILS_ADDRESS);
let error, circulation, locked, amount, denomination;

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
        document.getElementById('network-name').innerHTML = `<p style="text-align:center"><em>Please switch to Main network.</em></p>`;
      } else {
        // document.getElementById('network-name').innerHTML = `<p style="text-align:center">Current network: Main.</p>`;
        if (accounts.length > 0) {
          document.getElementById('connect-button').style.display = "none";
        } else {
          document.getElementById('connect-button').style.display = "block";
        }
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
  }

  locked = circulation * 2500;
  console.log("Locked: " + locked);
  document.getElementById("locked").innerHTML = `<h6>${locked}</h6>`;
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
