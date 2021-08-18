# AVA LABA ASSIGNMENT

>Started @ 12:54 on 8/11/2021

Ava Labs Path: /Users/kloy/go/pkg/mod/github.com/ava-labs/

Avalanche Go Version: 1.4.11
Avalanche Go Binary Path: /Users/kloy/go/src/github.com/ava-labs/avalanchego/build/avalanchego

Avash Version: 1.1.9
Avash Node Config File Path: /Users/kloy/.avash.yaml
# REMIX

Remix is a website that allows for interacting with & debugging smart contracts.

## REMIX PLUGINS

+ Control Flow Graph
+ Debugger
+ Gas Profiler
+ Remixd
+ Slither
+ Solidity Compiler
+ Solidity Compiler Logic
+ Solidity Static Analysis
+ Wallet Connect

## REMIX FAQ

If having trouble connecting to remix ensure these two things:

1. Ensure the package.json includes the correct path to the project.
2. Try connecting with "http://" instead of "https://"

## ETHERS.js NOTES

/* ETHERS.js DECODE TESTING
// IMPORTANT !!!
// const base58DecodeTest = ethers.utils.base58.decode(approval.hash);
const base64DecodeTest = ethers.utils.base64.decode(approval.hash);
// const RLPDecodeTest = ethers.utils.RLP.decode(base64DecodeTest);
// const bytes32Test = ethers.utils.parseBytes32String(approval.hash); // Not 32 bytes long
// const utf8Test = ethers.utils.toUtf8String(approval.hash);
// IMPORTANT !!!

// IMPORTANT !!!
// const test = ethers.utils.serializeTransaction(approval);
// const test = ethers.utils.serializeTransaction(approvalReceipt); // This just made a new hex of the entire transaction.
// const test = ethers.utils.parseTransaction(approval);
// const abiInterface = ethers.utils.Interface(ABI);
// IMPORTANT !!!

// IMPORTANT !!!
// These functions below turn strings into hashes, not vise versa!!!
// const idTest = ethers.utils.id(approval.data);
// const keccak256Test = ethers.utils.keccak256(approval.data);
// const sha256Test = ethers.utils.sha256(approval.data);
// IMPORTANT !!!
*/

## WEB3.js NOTES

/* Web3.js TESTING
// const web3CheckAddressChecksum = web3.utils.checkAddressChecksum(approval.hash);
// const web3BytesToHex = web3.utils.bytesToHex(approval.hash);
// const web3HexToAscii = web3.utils.hexToAscii(approval.hash);
// const web3ToAscii = web3.utils.toAscii(approval.hash);
// const web3HexToUtf8 = web3.utils.hexToUtf8(approval.hash);
*/
