export const Contract_address_cardService =
  "0x4dA06B18D8B66E878B730FcC23EF1A08aA47eef1";
export const Contract_abi_cardService = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "cardId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "checkWin",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "checkEgg",
        type: "uint8",
      },
    ],
    name: "FightResult",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_dna",
        type: "uint256",
      },
    ],
    name: "NewCard",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_cardId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "success",
        type: "uint8",
      },
    ],
    name: "UpgradeResult",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_cardId",
        type: "uint256",
      },
    ],
    name: "_battle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_amount",
        type: "uint8",
      },
    ],
    name: "_cardInit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "_setEggAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "_setGameItemAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_typeEgg",
        type: "bool",
      },
    ],
    name: "_userCreateCard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
    ],
    name: "getAllCardOfUser",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dna",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "winRate",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "upgrade",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "readyTime",
            type: "uint32",
          },
        ],
        internalType: "struct CardService.Card[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_listIds",
        type: "uint256[]",
      },
    ],
    name: "getInfoCard",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dna",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "winRate",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "upgrade",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "readyTime",
            type: "uint32",
          },
        ],
        internalType: "struct CardService.Card[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "listCard",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "dna",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "winRate",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "upgrade",
        type: "uint8",
      },
      {
        internalType: "uint32",
        name: "readyTime",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_cardId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_cardMaterial",
        type: "uint256",
      },
    ],
    name: "upgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
