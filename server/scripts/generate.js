const { secp256k1 : secp} = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");


// Generate a private key
//const privateKey = secp.utils.randomPrivateKey();
const privateKey = "416c2c042211b1d24e5bc7ef94c3db3d4dbcfa1e6dedeabe42373fc34c3a5e40";
console.log('Private Key (hex):', privateKey);

// Derive the public key from the private key
const publicKey = secp.getPublicKey(privateKey);
console.log('Public Key (hex):', toHex(publicKey));

const RECIPIENT_ADDRESS = '026e8afd30a122cf49a8a92b6229c9ec1b877661bcbb2c40e7d34cd763213e7cee';
const AMOUNT = 5;

// create signature from public key (sender address), recipient address, and amount
const bytes = utf8ToBytes(toHex(publicKey) + RECIPIENT_ADDRESS + AMOUNT);
const hash = keccak256(bytes);
const signature = secp.sign(hash, privateKey);

console.log('Signature (hex):', signature.toCompactHex());
console.log('Signature recovery:', signature.recovery);

// generate signature from compact hex and recovery bit
//var signature2 = secp.Signature.fromCompact(signature.toCompactHex());
//signature2 = signature2.addRecoveryBit(signature.recovery);

// recover public key from signature and hash
//var publicKey2 = signature2.recoverPublicKey(hash).toHex();
//console.log('Recovered Public Key (hex):', publicKey2);