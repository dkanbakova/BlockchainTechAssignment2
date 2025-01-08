const AIModelMarketplace = artifacts.require("AIModelMarketplace");

contract("AIModelMarketplace", (accounts) => {
    it("should allow a user to list a model", async () => {
        const contract = await AIModelMarketplace.deployed();
        await contract.listModel("Test Model", "This is a test model", web3.utils.toWei("1", "ether"), { from: accounts[0] });

        const model = await contract.models(0);
        assert.equal(model.name, "Test Model", "Model name is incorrect");
        assert.equal(model.description, "This is a test model", "Model description is incorrect");
    });

    it("should allow a user to purchase a model", async () => {
        const contract = await AIModelMarketplace.deployed();
        await contract.purchaseModel(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") });

        const isPurchased = await contract.purchased(0, accounts[1]);
        assert.isTrue(isPurchased, "Model was not marked as purchased");
    });
});
