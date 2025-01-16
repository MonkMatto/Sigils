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
      if (accounts.length > 0) {
        document.getElementById('connect-button').style.display = "none";
      } else {
        document.getElementById('connect-button').style.display = "block";
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
  document.getElementById("rift-status").style.display = "block";
  if (error) {
    console.log("Circulation was not retrieved");
    document.getElementById("rift-status").innerHTML = `<h4>The rift wasn't fully formed in this realm, and it fades back into the ether... WAY TO GO (try again later!)</h6>`;
  } else {
    circulation = Number(circulation).toLocaleString()
    console.log("Circulation: " + circulation);
    document.getElementById("circulation").innerHTML = `${circulation} / 777`;
    locked = circulation * 2500;
    console.log("Locked: " + locked);
    document.getElementById("locked").innerHTML = `${locked}`;
    document.getElementById("stats").style.display = "block";
    if (circulation > 0) {
      document.getElementById(
        "contract-interaction-placeholder"
      ).style.display = "none";
      document.getElementById("touch-or-run-buttons").style.display = "none";
      document.getElementById("contract-interactions").style.display = "block";
      document.getElementById("rift-status").innerHTML = `<h2><em>You touch the rift, and it pulses with magical energy!</em></h2>`;
      checkAllowance();
    } else {
      document.getElementById("rift-status").innerHTML = `<h4>The rift wasn't fully formed in this realm, and it fades back into the ether... WAY TO GO (try again later!)</h6>`;
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
    document.getElementById('allowance').innerHTML = `<input type="text" id="placeholder" value="Allowance: ${amount}" disabled>`
    // <p>Allowance: <strong>${amount}</strong></p>`;
  }
}

async function SUMMON() {
  console.log("Attempting to Summon a Guardian Sigil");

  const tokenRecipient = document.getElementById("token-recipient").value;
  console.log(`Summoning to: ${tokenRecipient}`);

  try {
    // Check if already summoned
    const alreadySummoned = await SIGILScontract.methods
      .hasBeenSummonedTo(tokenRecipient)
      .call();
    if (alreadySummoned) {
      alert(
        "Recipient has already been summoned a Guardian Sigil. Summoning aborted."
      );
      return;
    }

    // Fetch pledge data
    const pledgeData = await PLEDGEcontract.methods
      .getPledgerData(tokenRecipient)
      .call();
    const pledgerStatus = parseInt(pledgeData[0]);
    const pledgedBalance = BigInt(pledgeData[2]);

    // Validate pledge requirements
    if (pledgerStatus !== 1 || pledgedBalance < BigInt(1000000 * 10 ** 18)) {
      alert("Recipient does not meet Guardian requirements. Summoning aborted.");
      return;
    }

    // Summon the token
    console.log("Proceeding with Summoning...");
    await SIGILScontract.methods
      .SUMMON(tokenRecipient)
      .send({ from: currentAccount })
      .on("receipt", (receipt) => {
        console.log("Summoning Successful", receipt);
        alert("Summoning Successful!");
      })
      .on("error", (err) => {
        console.error("Error during summoning transaction:", err);
        alert("Summoning was not successful. Please try again.");
      });
  } catch (error) {
    console.error("An error occurred during the summoning process:", error);
    alert("Summoning was not successful. Please try again.");
  }
}

async function SACRIFICE() {
  console.log("Attempting to sacrifice a Guardian Sigil");

  // Get the token ID from the user input
  const tokenToSacrifice = document.getElementById("token-to-sacrifice").value;
  console.log(`Token to sacrifice: ${tokenToSacrifice}`);

  if (!tokenToSacrifice || isNaN(tokenToSacrifice)) {
    alert("Invalid token ID. Please enter a valid token ID to sacrifice.");
    console.error("Invalid token ID provided.");
    return;
  }

  try {
    // Check ownership of the token
    const tokenOwner = await SIGILScontract.methods
      .ownerOf(tokenToSacrifice)
      .call();
    if (tokenOwner.toLowerCase() !== currentAccount.toLowerCase()) {
      alert("You do not own this token. Only the owner can sacrifice a token.");
      console.error("Token ownership mismatch.");
      return;
    }

    console.log(
      "You are the owner of the token. Proceeding with the sacrifice..."
    );

    // Sacrifice the token
    await SIGILScontract.methods
      .SACRIFICE(tokenToSacrifice)
      .send({ from: currentAccount })
      .on("receipt", (receipt) => {
        console.log("Sacrifice Successful", receipt);
        alert(`Token #${tokenToSacrifice} successfully sacrificed.`);
      })
      .on("error", (err) => {
        console.error("Error during sacrifice transaction:", err);
        alert("Sacrifice was not successful. Please try again.");
      });
  } catch (error) {
    console.error("An error occurred during the sacrifice process:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
}

function runAway() {
  document.getElementById("no-thanks").style.display = "block";
  document.getElementById("run-away-button").style.display = "none";
  document.getElementById("touch-message").innerHTML="Journey back and TOUCH THE RIFT";
}


// document.getElementById("download-html").addEventListener("click", 

  async function downloadHTML() {
  const tokenIdInput = document.getElementById("token-to-retrieve").value;

  if (!tokenIdInput || isNaN(tokenIdInput) || tokenIdInput < 0 || tokenIdInput >= 777) {
      document.getElementById("message-center").innerHTML = "<p>Invalid Token ID. Enter a number between 0 and 776.</p>";
      return;
  }

  try {
      console.log("Fetching tokenURI for Token ID:", tokenIdInput);
      const tokenURI = await SIGILScontract.methods.tokenURI(tokenIdInput).call();

      // Decode the tokenURI JSON
      const decodedJson = JSON.parse(atob(tokenURI.slice(29)));
      const animationUrl = decodedJson.animation_url;
      
      if (!animationUrl) {
          document.getElementById("message-center").innerHTML = "<p>Error: animation_url not found in tokenURI.</p>";
          return;
      }

      // Decode the base64 content
      const base64Content = animationUrl.split(',')[1];
      const decodedHtml = atob(base64Content);
      
      // Create and save the HTML file
      const blob = new Blob([decodedHtml], { type: 'text/html' });
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = `GuardianSigils_${tokenIdInput}.html`;
      
      // Trigger download
      downloadLink.click();
      
      // Clean up
      URL.revokeObjectURL(downloadUrl);
      document.getElementById("message-center").innerHTML = `<p>HTML file for Token ID ${tokenIdInput} downloaded successfully.</p>`;
      
  } catch (error) {
      console.error("Error fetching tokenURI:", error);
      document.getElementById("message-center").innerHTML = `<p>Error fetching tokenURI: ${error.message}</p>`;
      alert("An unexpected error occurred. Please try again later.");
  }
}

// async function SACRIFICE() {
//   console.log("Attempting to Sacrifice a token");
//   tokeToSacrifice = document.getElementById('token-to-sacrifice').value;
//   console.log(`Sacrificing: ${tokeToSacrifice}`);
//   try {
//     await SIGILScontract.methods.SACRIFICE(tokeToSacrifice).send(
//       {
//         from: currentAccount,
//       },
//       function (err, res) {
//         if (err) {
//           console.log(err);
//           return;
//         }
//       }
//     );
//   } catch (errorMessage) {
//     error = true;
//   }
//   if (error) {
//     console.log("Sacrifice was not successfull");
//   } else {
//     console.log("Sacrifice Successful");
//   }
// }
