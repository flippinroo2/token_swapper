const Transaction = require('./Transaction.js');

module.exports = class TokenInterface {
  address;
  #admin;
  balance = 0;
  debug = false;
  totalSupply;
  totalMinted;

  constructor(token) {
    this.token = token;
    this.address = token.address;
    this.#admin = token.getAdmin();
    this.totalSupply = token.totalSupply();
    this.totalMinted = token.totalMinted();
  }

  async getAdmin() {
    const adminAddress = await this.#admin;
    return {
      address: adminAddress,
      balance: 0,
    };
  }

  async getMetadata() {
    const totalMinted = await this.totalMinted;
    const totalSupply = await this.totalSupply;
    return {
      address: this.address,
      admin: await this.getAdmin(),
      totalMinted: totalMinted.toNumber(),
      totalSupply: totalSupply.toNumber(),
    };
  }

  async getBalance(owner) {
    const balance = await this.token.balanceOf(owner);
    return balance.toNumber();
  }

  async getAllowance(owner, spender) {
    const allowance = await this.token.allowance(owner, spender);
    return allowance.toNumber();
  }

  async approve(arg1, arg2, arg3) {
    // const transaction = new Transaction(arg1, arg2, arg3, 'approve'); // Testing the "Transaction" object.
    if (arg3 === undefined) {
      return await this.token.approve(arg1, arg2);
    }
    return await this.token.approveFrom(arg1, arg2, arg3);
  }

  async transfer(arg1, arg2, arg3) {
    if (arg3 === undefined) {
      return await this.token.transfer(arg1, arg2);
    }
    return await this.token.transferFrom(arg1, arg2, arg3);
  }

  parseTransactionData({
    blockHash,
    blockNumber,
    confirmations,
    events,
    from,
    gasUsed,
    logs,
    status,
    to,
    transactionHash,
    transactionIndex,
    type,
  }) {
    if (this.debug) {
      logTransaction(transactionHash, blockNumber, from, gasUsed, to);
    }
    let eventObject = {};
    events.forEach((element, index, array) => {
      // console.log('element:');
      // console.dir(element);
      // console.log(`index ${index}`);
      if (index === 0) {
      }
      const eventProperty = element.hasOwnProperty('event');
      const argsProperty = element.hasOwnProperty('args');
      // const eventString = `event${index}`;
      if (eventProperty) {
        let eventArguments = {};
        if (argsProperty) {
          eventArguments.address = element.args[0];
          eventArguments.name = element.args[1].hash;
          eventArguments.symbol = element.args[2].hash;
          eventArguments.decimals = element.args[3];
          eventArguments.totalSupply = element.args[4].toNumber();
        }
        eventObject[element.event] = {
          signature: element.eventSignature,
          arguments: eventArguments,
        };
      }
      if (index === array.length - 1) {
        eventObject.data = element.data;
      }
    });
    return {
      from,
      to,
      transactionIndex,
      transactionHash,
      gasUsed: gasUsed.toNumber(),
      type,
      status,
      blockNumber,
      blockHash,
      confirmations,
      events: eventObject,
    };
  }

  logAccounts() {
    console.log('\n\nBALANCES:');
    console.log(
      `fujiAdmin: ${fujiMetadata.admin.balance}\tfujiMetadata: ${fujiMetadata.balance}\thakuAdmin: ${hakuMetadata.admin.balance}\thakuMetadata: ${hakuMetadata.balance}\towner: ${owner.balance}\treceiver: ${receiver.balance}\tsender: ${sender.balance}\ttateAdmin: ${tateMetadata.admin.balance}\ttateMetadata: ${tateMetadata.balance}\tuser: ${user.balance}`,
    );
    console.log('\nALLOWANCES:');
    console.log(
      `fujiAdmin: ${fujiMetadata.admin.ownerAllowance}\tfujiMetadata: ${fujiMetadata.ownerAllowance}\thakuAdmin: ${hakuMetadata.admin.ownerAllowance}\thakuMetadata: ${hakuMetadata.ownerAllowance}\towner: ${owner.ownerAllowance}\treceiver: ${receiver.ownerAllowance}\tsender: ${sender.ownerAllowance}\ttateAdmin: ${tateMetadata.admin.ownerAllowance}\ttateMetadata: ${tateMetadata.ownerAllowance}\tuser: ${user.ownerAllowance}`,
    );
  }

  logTransaction(transactionHash, blockNumber, from, gasUsed, to) {
    console.log(
      `Transaction: ${transactionHash}\nFrom: ${from}\nTo: ${to}\nBlock #: ${blockNumber}\nGas: ${gasUsed}`,
    );
  }

  get balance() {
    return this.balance;
  }

  set balance(amount) {
    this.balance = amount;
  }

  set debug(boolean) {
    this.debug = boolean;
  }
};
