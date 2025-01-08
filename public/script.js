let contract;
let web3;

// ABI and Contract Address
const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "listModel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "ModelListed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
    ],
    name: "ModelPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "rater",
        type: "address",
      },
    ],
    name: "ModelRated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
    ],
    name: "purchaseModel",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "rating",
        type: "uint8",
      },
    ],
    name: "rateModel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "modelId",
        type: "uint256",
      },
    ],
    name: "getModelDetails",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "averageRating",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hasPurchased",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
    name: "models",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "totalRating",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numberOfRatings",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextModelId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contractAddress = "0x412E5a8a63360e880A2a3BdF0c8523900258B0d6";

async function init() {
  if (window.ethereum) {
    // Connect to MetaMask
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    console.log("Connected Account:", accounts[0]);

    // Initialize Contract
    contract = new web3.eth.Contract(abi, contractAddress);
    loadModels();
  } else {
    alert("Please install MetaMask to use this application.");
  }
}

// List a New Model
document
  .getElementById("list-model-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("model-name").value;
    const description = document.getElementById("model-description").value;
    const price = document.getElementById("model-price").value;

    const accounts = await web3.eth.getAccounts();
    await contract.methods
      .listModel(name, description, web3.utils.toWei(price, "ether"))
      .send({ from: accounts[0] });

    alert("Model listed successfully!");
    loadModels();
  });

// Load All Models
async function loadModels() {
  document.getElementById("models").innerHTML = "";

  const nextModelId = await contract.methods.nextModelId().call();
  for (let i = 0; i < nextModelId; i++) {
    const model = await contract.methods.getModelDetails(i).call();
    displayModel(i, model);
  }
}

// Display a Single Model
function displayModel(id, model) {
  const modelsDiv = document.getElementById("models");
  const modelCard = document.createElement("div");
  modelCard.className = "model-card";

  modelCard.innerHTML = `
    <h3>${model[0]}</h3>
    <p>${model[1]}</p>
    <p>Price: ${web3.utils.fromWei(model[2], "ether")} ETH</p>
    <button onclick="purchaseModel(${id}, '${model[2]}')">Purchase</button>
    <button onclick="rateModel(${id})">Rate</button>
  `;

  modelsDiv.appendChild(modelCard);
}

// Purchase a Model
async function purchaseModel(modelId, price) {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.purchaseModel(modelId).send({
    from: accounts[0],
    value: price,
  });

  alert("Model purchased successfully!");
}

// Rate a Model
async function rateModel(modelId) {
  const rating = prompt("Rate the model (1-5):");
  if (rating < 1 || rating > 5) {
    alert("Invalid rating. Please rate between 1 and 5.");
    return;
  }

  const accounts = await web3.eth.getAccounts();
  await contract.methods.rateModel(modelId, parseInt(rating)).send({
    from: accounts[0],
  });

  alert("Model rated successfully!");
}

// Withdraw Funds
async function withdrawFunds() {
  try {
    const accounts = await web3.eth.getAccounts();
    const currentAccount = accounts[0];

    // Fetch the owner's address from the contract
    const owner = await contract.methods.owner().call();

    // Ensure that the current account is the owner
    if (currentAccount.toLowerCase() !== owner.toLowerCase()) {
      alert("You are not the owner of the contract!");
      return;
    }

    // Call the contract's withdraw function
    await contract.methods.withdrawFunds().send({ from: currentAccount });

    console.log("Funds withdrawn successfully!");
  } catch (error) {
    console.error("Error withdrawing funds:", error.message);
    alert("Error withdrawing funds: " + error.message);
  }
}

// Initialize the dApp
init();
