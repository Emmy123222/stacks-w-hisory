/*
 Deploy tx-categories to Stacks testnet using a private key.

 Usage (PowerShell):
   $env:PRIVATE_KEY="<your_testnet_private_key>"; node scripts/deploy-tx-categories.js

 On success, prints the contract ID and txId.
*/

// Load .env if present
try { require('dotenv').config(); } catch {}

const fs = require("fs");
const path = require("path");
const {
  makeContractDeploy,
  broadcastTransaction,
  broadcastRawTransaction,
  getAddressFromPrivateKey,
  TransactionVersion,
} = require("@stacks/transactions");
const { STACKS_TESTNET } = require("@stacks/network");

(async () => {
  try {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      console.error("Error: PRIVATE_KEY env var is required");
      process.exit(1);
    }

    const CONTRACT_NAME = process.env.CONTRACT_NAME || "tx-categories";

    const contractPath = path.resolve(__dirname, "..", "contract", "contracts", `${CONTRACT_NAME}.clar`);
    const codeBody = fs.readFileSync(contractPath, "utf8");

    const network = { ...STACKS_TESTNET, url: process.env.API_URL || "https://api.testnet.hiro.so" };

    const tx = await makeContractDeploy({
      contractName: CONTRACT_NAME,
      codeBody,
      senderKey: PRIVATE_KEY,
      network,
      fee: 2000n, // adjust if needed
      anchorMode: 3, // Any
    });

    let result;
    if (tx && typeof tx.serialize === 'function') {
      result = await broadcastTransaction(tx, network);
    } else {
      // Assume Uint8Array
      result = await broadcastRawTransaction(tx, network);
    }
    if ((result && result.error) || (result && result.reason)) {
      console.error("Broadcast error:", result);
      process.exit(1);
    }

    const txId = typeof result === "string" ? result : result.txid || result.txId || "";
    // Derive the signer (deployer) address from the private key for testnet
    const deployerAddress = getAddressFromPrivateKey(PRIVATE_KEY, TransactionVersion.Testnet);
    console.log("Deployed:");
    console.log("  Contract:", `${deployerAddress}.${CONTRACT_NAME}`);
    console.log("  TxID:", txId);
    console.log("Explorer:", `https://explorer.hiro.so/txid/${txId}?chain=testnet`);
  } catch (e) {
    console.error("Deployment failed:", e);
    process.exit(1);
  }
})();
