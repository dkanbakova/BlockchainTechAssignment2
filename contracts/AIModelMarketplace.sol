// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 ratingCount;
        uint8 totalRating;
    }

    Model[] public models;
    mapping(uint256 => mapping(address => bool)) public purchased;

    function listModel(string memory name, string memory description, uint256 price) public {
        models.push(Model(name, description, price, payable(msg.sender), 0, 0));
    }

    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect payment");
        require(!purchased[modelId][msg.sender], "Already purchased");
        model.creator.transfer(msg.value);
        purchased[modelId][msg.sender] = true;
    }

    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Model does not exist");
        require(purchased[modelId][msg.sender], "Model not purchased");
        require(rating >= 1 && rating <= 5, "Invalid rating");
        Model storage model = models[modelId];
        model.totalRating += rating;
        model.ratingCount++;
    }

    function getModelDetails(uint256 modelId) public view returns (
        string memory name,
        string memory description,
        uint256 price,
        address creator,
        uint8 averageRating
    ) {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        uint8 averageRating = model.ratingCount > 0 ? model.totalRating / model.ratingCount : 0;
        return (model.name, model.description, model.price, model.creator, averageRating);
    }
}
