import crypto from 'crypto';

class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.createGenesisBlock();
    }

    createGenesisBlock() {
        const genesisBlock = {
            blockId: 1,
            transactions: [],
            timestamp: Date.now(),
            previousHash: '0',
        };
        genesisBlock.hash = this.calculateHash(genesisBlock);
        this.chain.push(genesisBlock);
    }

    calculateHash(block) {
        const blockString = JSON.stringify(block, Object.keys(block).sort());
        return crypto.createHash('sha256').update(blockString).digest('hex');
    }

    addTransaction(senderErupeeId, receiverErupeeId, amount) {
        const transaction = {
            sender: senderErupeeId,
            receiver: receiverErupeeId,
            amount,
            timestamp: Date.now()
        };
        this.pendingTransactions.push(transaction);
        return this.chain.length + 1;
    }

    createBlock() {
        if (this.pendingTransactions.length === 0) return null;
        const previousBlock = this.chain[this.chain.length - 1];
        const newBlock = {
            blockId: this.chain.length + 1,
            transactions: this.pendingTransactions,
            timestamp: Date.now(),
            previousHash: previousBlock.hash,
        };
        newBlock.hash = this.calculateHash(newBlock);
        this.chain.push(newBlock);
        this.pendingTransactions = [];
        return newBlock;
    }

    getChain() {
        return this.chain;
    }
}

export default Blockchain;