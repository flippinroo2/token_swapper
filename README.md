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

## PSEUDOCODE

1. Deploy Wrapper contract with 2 arguments (sender address & a receiver address). This will include all of the sub-contracts within this call.

2. Call the mint() function on the 3 tokens created (fuji, haku and tate | A, B and C). I have statically set the max supply to 1,100 for contract A, 1,050 for contract B and 1,000 for contract C. These max supply numbers were chosen because of the instructions requiring the swapping of tokens & then depositing 1,000 tokens to the testnet address.

3. I have created a Swap contract (which probably could've been a library) to handle the swapping of tokens. Instances of the Swap contract have been pre-created to only allow tokens A & C / B & C to be swapped (both pairs in both directions).

4. The Wrapper contract has a "swap()" and "unswap()" function to interface with these pairs. (All you have to do is pass in an argument of the number of tokens to swap).

5. The contract is not fully operational at the moment (...unfortunately :/), but I will be updating the code once I finish it up. (I ran into two issues that took up a lot of my time. I couldn't get Avash to accept rpc connections & I had trouble with instantiating & passing the ERC20 tokens between the Wrapper & Swapper contracts.)

