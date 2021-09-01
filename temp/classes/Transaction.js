module.exports = class Transaction {
  type;
  // Create enum type for the types of transaction.
  constructor(owner, spender, amount, type) {
    // Might make these non instance variables & just pass the values to the "transact()" function below.
    this.owner = owner;
    this.spender = spender;
    this.amount = amount;
    this.type = type;
    this.transact();
  }

  transact() {
    if (this.type === 'approve') {
    }
    if (this.type === 'allow') {
    }
    if (this.type === 'transfer') {
    }
    if (this.type === 'mint') {
    }
  }
};
