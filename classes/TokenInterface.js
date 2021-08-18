const Transaction = require('./Transaction.js');

module.exports = class TokenInterface {
  address;
  #_admin;
  fujiBalance = 0;
  debug = false;
  #_name;
  #_symbol;
  #_totalSupply;
  #_totalMinted;

  constructor(token) {
    this.token = token;
    this.address = token.address;
    this.#_admin = token.getAdmin();
    this.#_name = token._name();
    this.#_symbol = token._symbol();
    this.#_totalSupply = token.totalSupply();
    this.#_totalMinted = token.totalMinted();
  }

  async getAdmin() {
    const admin = await this.#_admin;
    const name = this.name.toLowerCase();

    const adminObject = {
      address: admin,
    };
    adminObject[`${name}Balance`] = 0;
    return adminObject;
  }

  async getMetadata() {
    const address = this.address;
    const name = await this.#_name;
    this.name = name;
    this.symbol = await this.#_symbol;
    const totalMinted = await this.#_totalMinted;
    this.totalMinted = totalMinted.toNumber();
    const totalSupply = await this.#_totalSupply;
    this.totalSupply = totalSupply.toNumber();
    const metadata = {
      address,
      admin: await this.getAdmin(),
      name,
      symbol: this.symbol,
      totalMinted: this.totalMinted,
      totalSupply: this.totalSupply,
    };
    metadata[`${name.toLowerCase()}Balance`] = await this.getBalance(address);
    return metadata;
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
