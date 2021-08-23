# AVA LABS ASSIGNMENT INSTRUCTIONS

> Swap Solidity Smart Contract & Deploy on Avalanche.

## Instructions

1. Should be able to swap either of two ERC20s for a single ERC20. (Example: A or B for C & C for A or B)

__* We do not need a method to swap A for B.__

__*Exchange rate is 1 to 1.__

2. Each token should have it's own unique name and symbol. (Do not name them A, B & C)

3. Token A & B should be minted outside of the wrapper contract. The wrapper token should not be allowed to mint any new A or B tokens. The wrapper contract should ONLY be for token C (code & mint ability).

__*Only Openzepplen Contracts are allowed (No other source)__

## Avalanche Ecosystem Information

Avalanche is a multi-blockchain ecosystem. They have 3 main chains (X-Chain, P-Chain and C-Chain). We will be deploying to C-Chain. (USE THE FUJU TESTNET!!!)

## Deliverables

1. Source code for the deployed wrapper contract. (Tokens A, B & C + any other contracts used)
2. The Fuji development address of each contract from step 1.
3. A pseudocode call sequence for the correct order & arguments to deploy all contracts and swap 100 token A for C, then convert 50 token C to token B.
4. Transfer 1000 of token A and token B to fuji address __0x808cE8deC9E10beD8d0892aCEEf9F1B8ec2F52Bd__.
