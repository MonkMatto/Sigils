const URI_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_traits",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_locations",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_svg",
        type: "address",
      },
      { indexed: false, internalType: "string", name: "_name", type: "string" },
      { indexed: false, internalType: "uint16", name: "_max", type: "uint16" },
      {
        indexed: false,
        internalType: "bool",
        name: "_openToAll",
        type: "bool",
      },
    ],
    name: "NewShapeshifter",
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
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_state",
        type: "uint256",
      },
    ],
    name: "Shapeshift",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "address", name: "_addy", type: "address" },
      { internalType: "uint256", name: "_state", type: "uint256" },
    ],
    name: "PREVIEW_SHAPESHIFTER_B64",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "address", name: "_addy", type: "address" },
      { internalType: "uint256", name: "_state", type: "uint256" },
    ],
    name: "PREVIEW_SHAPESHIFTER_SVG",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_state", type: "uint256" }],
    name: "RANDOM_RENDER_B64",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_state", type: "uint256" }],
    name: "RANDOM_RENDER_SVG",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint256", name: "_state", type: "uint256" },
    ],
    name: "SHAPESHIFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "Shapeshifters",
    outputs: [
      { internalType: "address", name: "traits", type: "address" },
      { internalType: "address", name: "locats", type: "address" },
      { internalType: "address", name: "svg", type: "address" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint16", name: "max", type: "uint16" },
      { internalType: "uint16", name: "active", type: "uint16" },
      { internalType: "bool", name: "openToAll", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_traits", type: "address" },
      { internalType: "address", name: "_locations", type: "address" },
      { internalType: "address", name: "_svg", type: "address" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint16", name: "_max", type: "uint16" },
      { internalType: "bool", name: "_openToAll", type: "bool" },
    ],
    name: "addShapeshifter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "string", name: "_name", type: "string" },
    ],
    name: "addUniqueName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "artistNameOverride",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_collectionDescription",
        type: "string",
      },
      { internalType: "string", name: "_externalURL", type: "string" },
      { internalType: "uint256", name: "_royaltyBps", type: "uint256" },
      { internalType: "address", name: "_artistAddy", type: "address" },
      { internalType: "string", name: "_svg", type: "string" },
    ],
    name: "buildContractURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      {
        internalType: "string",
        name: "_collectionDescription",
        type: "string",
      },
      { internalType: "address", name: "_artistAddy", type: "address" },
      { internalType: "uint256", name: "_royaltyBps", type: "uint256" },
      { internalType: "string", name: "_collection", type: "string" },
      { internalType: "string", name: "_website", type: "string" },
      { internalType: "string", name: "_externalURL", type: "string" },
    ],
    name: "buildMetaPart",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenEntropy", type: "uint256" },
      { internalType: "uint256", name: "_addressEntropy", type: "uint256" },
    ],
    name: "buildPreviewSVG",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_legibleURI", type: "string" }],
    name: "getBase64TokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_metaP", type: "string" },
      { internalType: "uint256", name: "_tokenEntropy", type: "uint256" },
      { internalType: "uint256", name: "_ownerEntropy", type: "uint256" },
    ],
    name: "getLegibleTokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getShapeshiftAvailability",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "getTokenShapeshiftTotals",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "idMap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
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
      { internalType: "string", name: "_artistNameOverride", type: "string" },
    ],
    name: "setArtistNameOverride",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_descriptionsContract",
        type: "address",
      },
    ],
    name: "setDescriptionsContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "shapeshiftingAllowed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "shifterStateMap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "toggleShapeshiftingAllowed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "tokenShiftCounts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "tokenStateLock",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "uniqueNameMap",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_state", type: "uint256" },
      { internalType: "address", name: "_traits", type: "address" },
      { internalType: "address", name: "_locats", type: "address" },
      { internalType: "address", name: "_svg", type: "address" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint16", name: "_max", type: "uint16" },
      { internalType: "uint16", name: "_active", type: "uint16" },
      { internalType: "bool", name: "_openToAll", type: "bool" },
    ],
    name: "updateShapeshifter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
