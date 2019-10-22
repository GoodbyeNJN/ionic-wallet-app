module.exports = {
  abi: [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_spender", type: "address" }, { name: "_value", type: "uint256" }],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_from", type: "address" },
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "unpause",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "paused",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_spender", type: "address" },
        { name: "_subtractedValue", type: "uint256" },
      ],
      name: "decreaseApproval",
      outputs: [{ name: "success", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "pause",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_spender", type: "address" }, { name: "_addedValue", type: "uint256" }],
      name: "increaseApproval",
      outputs: [{ name: "success", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }, { name: "_spender", type: "address" }],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { name: "inputSymbol", type: "string" },
        { name: "inputName", type: "string" },
        { name: "inputSupply", type: "uint256" },
        { name: "inputDecimals", type: "uint8" },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    { anonymous: false, inputs: [], name: "Pause", type: "event" },
    { anonymous: false, inputs: [], name: "Unpause", type: "event" },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "previousOwner", type: "address" },
        { indexed: true, name: "newOwner", type: "address" },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "owner", type: "address" },
        { indexed: true, name: "spender", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
  ],
  bytecode:
    "60806040526003805460a060020a60ff021916905534801561002057600080fd5b50604051610d35380380610d35833981016040908152815160208084015192840151606085015160038054600160a060020a03191633179055928501805190959490940193909291610077916004918701906100c4565b50825161008b9060059060208601906100c4565b50600a81900a60ff90811683026000908155338152600160205260409020929092556006805460ff1916919092161790555061015f9050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061010557805160ff1916838001178555610132565b82800160010185558215610132579182015b82811115610132578251825591602001919060010190610117565b5061013e929150610142565b5090565b61015c91905b8082111561013e5760008155600101610148565b90565b610bc78061016e6000396000f3006080604052600436106100e55763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100ea578063095ea7b31461017457806318160ddd146101ac57806323b872dd146101d3578063313ce567146101fd5780633f4ba83a146102285780635c975abb1461023f578063661884631461025457806370a08231146102785780638456cb59146102995780638da5cb5b146102ae57806395d89b41146102df578063a9059cbb146102f4578063d73dd62314610318578063dd62ed3e1461033c578063f2fde38b14610363575b600080fd5b3480156100f657600080fd5b506100ff610384565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610139578181015183820152602001610121565b50505050905090810190601f1680156101665780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561018057600080fd5b50610198600160a060020a0360043516602435610412565b604080519115158252519081900360200190f35b3480156101b857600080fd5b506101c161043d565b60408051918252519081900360200190f35b3480156101df57600080fd5b50610198600160a060020a0360043581169060243516604435610443565b34801561020957600080fd5b50610212610470565b6040805160ff9092168252519081900360200190f35b34801561023457600080fd5b5061023d610479565b005b34801561024b57600080fd5b506101986104f1565b34801561026057600080fd5b50610198600160a060020a0360043516602435610501565b34801561028457600080fd5b506101c1600160a060020a0360043516610525565b3480156102a557600080fd5b5061023d610540565b3480156102ba57600080fd5b506102c36105bd565b60408051600160a060020a039092168252519081900360200190f35b3480156102eb57600080fd5b506100ff6105cc565b34801561030057600080fd5b50610198600160a060020a0360043516602435610627565b34801561032457600080fd5b50610198600160a060020a036004351660243561064b565b34801561034857600080fd5b506101c1600160a060020a036004358116906024351661066f565b34801561036f57600080fd5b5061023d600160a060020a036004351661069a565b6005805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561040a5780601f106103df5761010080835404028352916020019161040a565b820191906000526020600020905b8154815290600101906020018083116103ed57829003601f168201915b505050505081565b60035460009060a060020a900460ff161561042c57600080fd5b610436838361072f565b9392505050565b60005481565b60035460009060a060020a900460ff161561045d57600080fd5b610468848484610795565b949350505050565b60065460ff1681565b600354600160a060020a0316331461049057600080fd5b60035460a060020a900460ff1615156104a857600080fd5b6003805474ff0000000000000000000000000000000000000000191690556040517f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b3390600090a1565b60035460a060020a900460ff1681565b60035460009060a060020a900460ff161561051b57600080fd5b610436838361090e565b600160a060020a031660009081526001602052604090205490565b600354600160a060020a0316331461055757600080fd5b60035460a060020a900460ff161561056e57600080fd5b6003805474ff0000000000000000000000000000000000000000191660a060020a1790556040517f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff62590600090a1565b600354600160a060020a031681565b6004805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561040a5780601f106103df5761010080835404028352916020019161040a565b60035460009060a060020a900460ff161561064157600080fd5b61043683836109fe565b60035460009060a060020a900460ff161561066557600080fd5b6104368383610ae1565b600160a060020a03918216600090815260026020908152604080832093909416825291909152205490565b600354600160a060020a031633146106b157600080fd5b600160a060020a03811615156106c657600080fd5b600354604051600160a060020a038084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a36003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b336000818152600260209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b6000600160a060020a03831615156107ac57600080fd5b600160a060020a0384166000908152600160205260409020548211156107d157600080fd5b600160a060020a038416600090815260026020908152604080832033845290915290205482111561080157600080fd5b600160a060020a03841660009081526001602052604090205461082a908363ffffffff610b7a16565b600160a060020a03808616600090815260016020526040808220939093559085168152205461085f908363ffffffff610b8c16565b600160a060020a0380851660009081526001602090815260408083209490945591871681526002825282812033825290915220546108a3908363ffffffff610b7a16565b600160a060020a03808616600081815260026020908152604080832033845282529182902094909455805186815290519287169391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a35060019392505050565b336000908152600260209081526040808320600160a060020a03861684529091528120548083111561096357336000908152600260209081526040808320600160a060020a0388168452909152812055610998565b610973818463ffffffff610b7a16565b336000908152600260209081526040808320600160a060020a03891684529091529020555b336000818152600260209081526040808320600160a060020a0389168085529083529281902054815190815290519293927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a35060019392505050565b6000600160a060020a0383161515610a1557600080fd5b33600090815260016020526040902054821115610a3157600080fd5b33600090815260016020526040902054610a51908363ffffffff610b7a16565b3360009081526001602052604080822092909255600160a060020a03851681522054610a83908363ffffffff610b8c16565b600160a060020a0384166000818152600160209081526040918290209390935580518581529051919233927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a350600192915050565b336000908152600260209081526040808320600160a060020a0386168452909152812054610b15908363ffffffff610b8c16565b336000818152600260209081526040808320600160a060020a0389168085529083529281902085905580519485525191937f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929081900390910190a350600192915050565b600082821115610b8657fe5b50900390565b60008282018381101561043657fe00a165627a7a72305820bd1d89d30f64b929c496d79e0fc4dccbd038ee5c1cf70c2dce7dd3cd9cf79a200029",
};