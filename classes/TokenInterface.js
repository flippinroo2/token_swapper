const Transaction = require('./Transaction.js');

module.exports = class TokenInterface {
  address;
  admin;
  balance = 0;
  debug = false;
  totalSupply;
  totalMinted;

  constructor(token) {
    this.token = token;
    this.address = token.address;
    this.admin = token.getAdmin();
    this.totalSupply = token.totalSupply();
    this.totalMinted = token.totalMinted();
  }

  async getMetadata() {
    const totalMinted = await this.totalMinted;
    const totalSupply = await this.totalSupply;
    return {
      address: this.address,
      admin: {
        address: await this.admin,
        balance: 0,
      },
      totalMinted: totalMinted.toNumber(),
      totalSupply: totalSupply.toNumber(),
    };
  }

  async #approve() {
    debugger;
  }

  async #getAllowance() {
    debugger;
  }

  async #transfer() {}

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
