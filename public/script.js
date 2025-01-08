const web3 = new Web3(window.ethereum); // Connect to Metamask
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const contractABI = [
    // Add the ABI JSON here after deploying your contract
];
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function listModel() {
    const accounts = await web3.eth.requestAccounts();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = web3.utils.toWei(document.getElementById("price").value, "ether");

    await contract.methods.listModel(name, description, price).send({ from: accounts[0] });
    alert("Model listed successfully!");
    fetchModels(); // Refresh the model list
}

async function fetchModels() {
    const modelsContainer = document.getElementById("modelsContainer");
    modelsContainer.innerHTML = "";

    const modelCount = await contract.methods.modelsLength().call();
    for (let i = 0; i < modelCount; i++) {
        const model = await contract.methods.models(i).call();
        const modelElement = document.createElement("div");
        modelElement.innerHTML = `
            <p><strong>Name:</strong> ${model.name}</p>
            <p><strong>Description:</strong> ${model.description}</p>
            <p><strong>Price:</strong> ${web3.utils.fromWei(model.price, "ether")} ETH</p>
            <button onclick="purchaseModel(${i})">Purchase</button>
        `;
        modelsContainer.appendChild(modelElement);
    }
}

async function purchaseModel(modelId) {
    const accounts = await web3.eth.requestAccounts();
    const model = await contract.methods.models(modelId).call();
    await contract.methods.purchaseModel(modelId).send({
        from: accounts[0],
        value: model.price
    });
    alert("Model purchased successfully!");
}

window.onload = fetchModels;
