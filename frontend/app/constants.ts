export const CONTRACT_ADDRESS = '0xD2b8B4C20C0Dc6A0fF74d4a38d373291FA49E2E3';
export const CONTRACT_ABI = [
    {
      "inputs": [],
      "name": "MIN_STAKE",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "grantCount",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stake",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unstake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "metadataURI", "type": "string" },
        { "internalType": "uint256", "name": "amountWei", "type": "uint256" }
      ],
      "name": "requestGrant",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "grantId", "type": "uint256" }
      ],
      "name": "approveGrant",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "grantId", "type": "uint256" }
      ],
      "name": "getGrant",
      "outputs": [
        { "internalType": "address", "name": "requester", "type": "address" },
        { "internalType": "string", "name": "metadataURI", "type": "string" },
        { "internalType": "uint256", "name": "amountRequested", "type": "uint256" },
        { "internalType": "uint256", "name": "approvalWeight", "type": "uint256" },
        { "internalType": "bool", "name": "funded", "type": "bool" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getStakers",
      "outputs": [
        { "internalType": "address[]", "name": "", "type": "address[]" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "grantId", "type": "uint256" },
        { "internalType": "address", "name": "approver", "type": "address" }
      ],
      "name": "hasApproved",
      "outputs": [
        { "internalType": "bool", "name": "", "type": "bool" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "Staked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "Unstaked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "grantId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "requester", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "indexed": false, "internalType": "string", "name": "metadataURI", "type": "string" }
      ],
      "name": "GrantRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "grantId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "approver", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "newWeight", "type": "uint256" }
      ],
      "name": "GrantApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "grantId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "GrantFunded",
      "type": "event"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "stakes",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalStaked",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  
