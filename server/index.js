const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 : secp} = require('ethereum-cryptography/secp256k1');
const { utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");


app.use(cors());
app.use(express.json());

const balances = {
  "026e8afd30a122cf49a8a92b6229c9ec1b877661bcbb2c40e7d34cd763213e7cee": 100,
  "02496e4df25e645c45b14cd3142a3d86f606e99c8275f0b30dc00f2c16591a78c8": 50,
  "03f81b908acef7a551fcad82599ff00c0723bcfc69c1d8ace5655fa5f651ce628e": 75,
  "034eca72365e8092cf55671dfbacbd8bcb5190729f2233f0a0a31d7b5202369d2f": 110,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signatureHex, recoveryBit} = req.body;

  const bytes = utf8ToBytes(sender + recipient + amount);

  const hash = keccak256(bytes);

  const signature = secp.Signature.fromCompact(signatureHex).addRecoveryBit(recoveryBit);

  const publicKey = signature.recoverPublicKey(hash).toHex();

  if (publicKey !== sender) {
    res.status(400).send({ message: "Invalid signature!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
