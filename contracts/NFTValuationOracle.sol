// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title NFT Valuation Oracle
 * @dev Smart contract for storing and managing NFT valuations and rarity scores
 * @author NFT Valuation Engine Team
 */
contract NFTValuationOracle is Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // Structs
    struct NFTValuation {
        address contractAddress;
        uint256 tokenId;
        uint256 estimatedValue;
        uint256 rarityScore;
        uint256 rarityRank;
        uint256 timestamp;
        address valuator;
        bool isVerified;
        string methodology;
        uint256 confidence;
    }
    
    struct CollectionStats {
        uint256 totalSupply;
        uint256 floorPrice;
        uint256 averagePrice;
        uint256 totalVolume;
        uint256 holderCount;
        uint256 lastUpdated;
        bool isActive;
    }
    
    struct RarityTrait {
        string traitType;
        string traitValue;
        uint256 frequency;
        uint256 rarityScore;
    }
    
    struct ValuationFee {
        uint256 basicFee;
        uint256 advancedFee;
        uint256 verificationFee;
    }
    
    // State variables
    Counters.Counter private _valuationIds;
    mapping(bytes32 => NFTValuation) public valuations;
    mapping(bytes32 => NFTValuation[]) public valuationHistory;
    mapping(address => CollectionStats) public collectionStats;
    mapping(address => bool) public authorizedValuators;
    mapping(bytes32 => RarityTrait[]) public nftTraits;
    mapping(address => uint256) public valuatorReputations;
    
    ValuationFee public fees;
    uint256 public constant MIN_CONFIDENCE = 60;
    uint256 public constant MAX_CONFIDENCE = 100;
    
    // Events
    event ValuationSubmitted(
        bytes32 indexed valuationId,
        address indexed contractAddress,
        uint256 indexed tokenId,
        uint256 estimatedValue,
        uint256 rarityScore,
        address valuator,
        uint256 confidence
    );
    
    event ValuationVerified(
        bytes32 indexed valuationId,
        address indexed verifier
    );
    
    event CollectionStatsUpdated(
        address indexed contractAddress,
        uint256 floorPrice,
        uint256 averagePrice,
        uint256 totalVolume
    );
    
    event ValuatorAuthorized(address indexed valuator);
    event ValuatorRevoked(address indexed valuator);
    event FeesUpdated(uint256 basicFee, uint256 advancedFee, uint256 verificationFee);
    
    // Modifiers
    modifier onlyAuthorizedValuator() {
        require(authorizedValuators[msg.sender], "Not authorized valuator");
        _;
    }
    
    modifier validNFT(address contractAddress, uint256 tokenId) {
        require(contractAddress != address(0), "Invalid contract address");
        require(isValidNFT(contractAddress, tokenId), "NFT does not exist");
        _;
    }
    
    modifier validConfidence(uint256 confidence) {
        require(confidence >= MIN_CONFIDENCE && confidence <= MAX_CONFIDENCE, "Invalid confidence level");
        _;
    }
    
    constructor() {
        authorizedValuators[msg.sender] = true;
        fees = ValuationFee({
            basicFee: 0.001 ether,
            advancedFee: 0.005 ether,
            verificationFee: 0.01 ether
        });
    }
    
    /**
     * @dev Submit a new valuation for an NFT
     */
    function submitValuation(
        address contractAddress,
        uint256 tokenId,
        uint256 estimatedValue,
        uint256 rarityScore,
        uint256 rarityRank,
        string memory methodology,
        uint256 confidence
    ) external payable onlyAuthorizedValuator validNFT(contractAddress, tokenId) validConfidence(confidence) whenNotPaused {
        require(msg.value >= fees.basicFee, "Insufficient fee");
        
        bytes32 valuationId = keccak256(abi.encodePacked(contractAddress, tokenId, block.timestamp, msg.sender));
        
        NFTValuation memory newValuation = NFTValuation({
            contractAddress: contractAddress,
            tokenId: tokenId,
            estimatedValue: estimatedValue,
            rarityScore: rarityScore,
            rarityRank: rarityRank,
            timestamp: block.timestamp,
            valuator: msg.sender,
            isVerified: false,
            methodology: methodology,
            confidence: confidence
        });
        
        valuations[valuationId] = newValuation;
        valuationHistory[keccak256(abi.encodePacked(contractAddress, tokenId))].push(newValuation);
        
        _valuationIds.increment();
        
        // Update valuator reputation
        valuatorReputations[msg.sender] += 1;
        
        emit ValuationSubmitted(
            valuationId,
            contractAddress,
            tokenId,
            estimatedValue,
            rarityScore,
            msg.sender,
            confidence
        );
    }
    
    /**
     * @dev Get current valuation for an NFT
     */
    function getCurrentValuation(
        address contractAddress,
        uint256 tokenId
    ) external view returns (NFTValuation memory) {
        bytes32 key = keccak256(abi.encodePacked(contractAddress, tokenId));
        NFTValuation[] memory history = valuationHistory[key];
        require(history.length > 0, "No valuations found");
        
        return history[history.length - 1];
    }
    
    /**
     * @dev Get valuation history for an NFT
     */
    function getValuationHistory(
        address contractAddress,
        uint256 tokenId
    ) external view returns (NFTValuation[] memory) {
        bytes32 key = keccak256(abi.encodePacked(contractAddress, tokenId));
        return valuationHistory[key];
    }
    
    /**
     * @dev Update collection statistics
     */
    function updateCollectionStats(
        address contractAddress,
        uint256 totalSupply,
        uint256 floorPrice,
        uint256 averagePrice,
        uint256 totalVolume,
        uint256 holderCount
    ) external onlyAuthorizedValuator whenNotPaused {
        CollectionStats storage stats = collectionStats[contractAddress];
        stats.totalSupply = totalSupply;
        stats.floorPrice = floorPrice;
        stats.averagePrice = averagePrice;
        stats.totalVolume = totalVolume;
        stats.holderCount = holderCount;
        stats.lastUpdated = block.timestamp;
        stats.isActive = true;
        
        emit CollectionStatsUpdated(contractAddress, floorPrice, averagePrice, totalVolume);
    }
    
    /**
     * @dev Store rarity traits for an NFT
     */
    function setNFTTraits(
        address contractAddress,
        uint256 tokenId,
        RarityTrait[] memory traits
    ) external onlyAuthorizedValuator whenNotPaused {
        bytes32 key = keccak256(abi.encodePacked(contractAddress, tokenId));
        delete nftTraits[key];
        
        for (uint256 i = 0; i < traits.length; i++) {
            nftTraits[key].push(traits[i]);
        }
    }
    
    /**
     * @dev Get rarity traits for an NFT
     */
    function getNFTTraits(
        address contractAddress,
        uint256 tokenId
    ) external view returns (RarityTrait[] memory) {
        bytes32 key = keccak256(abi.encodePacked(contractAddress, tokenId));
        return nftTraits[key];
    }
    
    /**
     * @dev Verify a valuation
     */
    function verifyValuation(bytes32 valuationId) external payable onlyOwner {
        require(msg.value >= fees.verificationFee, "Insufficient verification fee");
        require(valuations[valuationId].timestamp != 0, "Valuation does not exist");
        
        valuations[valuationId].isVerified = true;
        
        // Increase valuator reputation for verified valuations
        valuatorReputations[valuations[valuationId].valuator] += 5;
        
        emit ValuationVerified(valuationId, msg.sender);
    }
    
    /**
     * @dev Authorize a new valuator
     */
    function authorizeValuator(address valuator) external onlyOwner {
        authorizedValuators[valuator] = true;
        emit ValuatorAuthorized(valuator);
    }
    
    /**
     * @dev Revoke valuator authorization
     */
    function revokeValuator(address valuator) external onlyOwner {
        authorizedValuators[valuator] = false;
        emit ValuatorRevoked(valuator);
    }
    
    /**
     * @dev Update fees
     */
    function updateFees(
        uint256 basicFee,
        uint256 advancedFee,
        uint256 verificationFee
    ) external onlyOwner {
        fees.basicFee = basicFee;
        fees.advancedFee = advancedFee;
        fees.verificationFee = verificationFee;
        
        emit FeesUpdated(basicFee, advancedFee, verificationFee);
    }
    
    /**
     * @dev Get collection statistics
     */
    function getCollectionStats(address contractAddress) external view returns (CollectionStats memory) {
        return collectionStats[contractAddress];
    }
    
    /**
     * @dev Check if a valuator is authorized
     */
    function isAuthorizedValuator(address valuator) external view returns (bool) {
        return authorizedValuators[valuator];
    }
    
    /**
     * @dev Get total number of valuations
     */
    function getTotalValuations() external view returns (uint256) {
        return _valuationIds.current();
    }
    
    /**
     * @dev Get valuator reputation
     */
    function getValuatorReputation(address valuator) external view returns (uint256) {
        return valuatorReputations[valuator];
    }
    
    /**
     * @dev Batch update multiple NFT valuations
     */
    function batchUpdateValuations(
        address[] memory contractAddresses,
        uint256[] memory tokenIds,
        uint256[] memory estimatedValues,
        uint256[] memory rarityScores,
        uint256[] memory rarityRanks,
        string[] memory methodologies,
        uint256[] memory confidences
    ) external payable onlyAuthorizedValuator whenNotPaused {
        require(
            contractAddresses.length == tokenIds.length &&
            tokenIds.length == estimatedValues.length &&
            estimatedValues.length == rarityScores.length &&
            rarityScores.length == rarityRanks.length &&
            rarityRanks.length == methodologies.length &&
            methodologies.length == confidences.length,
            "Array lengths must match"
        );
        
        uint256 totalFee = fees.basicFee * contractAddresses.length;
        require(msg.value >= totalFee, "Insufficient fee for batch operation");
        
        for (uint256 i = 0; i < contractAddresses.length; i++) {
            submitValuation(
                contractAddresses[i],
                tokenIds[i],
                estimatedValues[i],
                rarityScores[i],
                rarityRanks[i],
                methodologies[i],
                confidences[i]
            );
        }
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Emergency unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Check if NFT is valid
     */
    function isValidNFT(address contractAddress, uint256 tokenId) internal view returns (bool) {
        try IERC721(contractAddress).ownerOf(tokenId) returns (address owner) {
            return owner != address(0);
        } catch {
            return false;
        }
    }
    
    /**
     * @dev Get average confidence for a collection
     */
    function getAverageConfidence(address contractAddress) external view returns (uint256) {
        CollectionStats memory stats = collectionStats[contractAddress];
        if (stats.totalSupply == 0) return 0;
        
        uint256 totalConfidence = 0;
        uint256 count = 0;
        
        // This is a simplified version - in production, you'd want to optimize this
        for (uint256 i = 0; i < stats.totalSupply; i++) {
            bytes32 key = keccak256(abi.encodePacked(contractAddress, i));
            NFTValuation[] memory history = valuationHistory[key];
            if (history.length > 0) {
                totalConfidence += history[history.length - 1].confidence;
                count++;
            }
        }
        
        return count > 0 ? totalConfidence / count : 0;
    }
}