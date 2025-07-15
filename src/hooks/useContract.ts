import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

// Contract ABI (simplified for demo)
const CONTRACT_ABI = [
  "function submitValuation(address contractAddress, uint256 tokenId, uint256 estimatedValue, uint256 rarityScore, uint256 rarityRank, string memory methodology, uint256 confidence) external payable",
  "function getCurrentValuation(address contractAddress, uint256 tokenId) external view returns (tuple(address contractAddress, uint256 tokenId, uint256 estimatedValue, uint256 rarityScore, uint256 rarityRank, uint256 timestamp, address valuator, bool isVerified, string methodology, uint256 confidence))",
  "function getValuationHistory(address contractAddress, uint256 tokenId) external view returns (tuple(address contractAddress, uint256 tokenId, uint256 estimatedValue, uint256 rarityScore, uint256 rarityRank, uint256 timestamp, address valuator, bool isVerified, string methodology, uint256 confidence)[])",
  "function getCollectionStats(address contractAddress) external view returns (tuple(uint256 totalSupply, uint256 floorPrice, uint256 averagePrice, uint256 totalVolume, uint256 holderCount, uint256 lastUpdated, bool isActive))",
  "function isAuthorizedValuator(address valuator) external view returns (bool)",
  "function getTotalValuations() external view returns (uint256)",
  "function getValuatorReputation(address valuator) external view returns (uint256)",
  "function fees() external view returns (tuple(uint256 basicFee, uint256 advancedFee, uint256 verificationFee))",
  "event ValuationSubmitted(bytes32 indexed valuationId, address indexed contractAddress, uint256 indexed tokenId, uint256 estimatedValue, uint256 rarityScore, address valuator, uint256 confidence)"
];

// Demo contract address (replace with actual deployed contract)
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

export const useContract = () => {
  const { provider, signer, account, isConnected } = useWeb3();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider && signer && isConnected) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
    }
  }, [provider, signer, isConnected]);

  const submitValuation = async (
    contractAddress: string,
    tokenId: string,
    estimatedValue: string,
    rarityScore: string,
    rarityRank: string,
    methodology: string,
    confidence: string
  ) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const tx = await contract.submitValuation(
        contractAddress,
        tokenId,
        ethers.utils.parseEther(estimatedValue),
        ethers.utils.parseUnits(rarityScore, 2),
        rarityRank,
        methodology,
        confidence,
        { value: ethers.utils.parseEther("0.001") }
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error submitting valuation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentValuation = async (contractAddress: string, tokenId: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const result = await contract.getCurrentValuation(contractAddress, tokenId);
      return {
        contractAddress: result.contractAddress,
        tokenId: result.tokenId.toString(),
        estimatedValue: ethers.utils.formatEther(result.estimatedValue),
        rarityScore: ethers.utils.formatUnits(result.rarityScore, 2),
        rarityRank: result.rarityRank.toString(),
        timestamp: result.timestamp.toString(),
        valuator: result.valuator,
        isVerified: result.isVerified,
        methodology: result.methodology,
        confidence: result.confidence.toString()
      };
    } catch (error) {
      console.error('Error getting current valuation:', error);
      throw error;
    }
  };

  const getValuationHistory = async (contractAddress: string, tokenId: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const result = await contract.getValuationHistory(contractAddress, tokenId);
      return result.map((valuation: any) => ({
        contractAddress: valuation.contractAddress,
        tokenId: valuation.tokenId.toString(),
        estimatedValue: ethers.utils.formatEther(valuation.estimatedValue),
        rarityScore: ethers.utils.formatUnits(valuation.rarityScore, 2),
        rarityRank: valuation.rarityRank.toString(),
        timestamp: valuation.timestamp.toString(),
        valuator: valuation.valuator,
        isVerified: valuation.isVerified,
        methodology: valuation.methodology,
        confidence: valuation.confidence.toString()
      }));
    } catch (error) {
      console.error('Error getting valuation history:', error);
      throw error;
    }
  };

  const getCollectionStats = async (contractAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const result = await contract.getCollectionStats(contractAddress);
      return {
        totalSupply: result.totalSupply.toString(),
        floorPrice: ethers.utils.formatEther(result.floorPrice),
        averagePrice: ethers.utils.formatEther(result.averagePrice),
        totalVolume: ethers.utils.formatEther(result.totalVolume),
        holderCount: result.holderCount.toString(),
        lastUpdated: result.lastUpdated.toString(),
        isActive: result.isActive
      };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      throw error;
    }
  };

  const isAuthorizedValuator = async (address: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      return await contract.isAuthorizedValuator(address);
    } catch (error) {
      console.error('Error checking valuator authorization:', error);
      throw error;
    }
  };

  const getTotalValuations = async () => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const result = await contract.getTotalValuations();
      return result.toString();
    } catch (error) {
      console.error('Error getting total valuations:', error);
      throw error;
    }
  };

  const getValuatorReputation = async (address: string) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const result = await contract.getValuatorReputation(address);
      return result.toString();
    } catch (error) {
      console.error('Error getting valuator reputation:', error);
      throw error;
    }
  };

  const getFees = async () => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const result = await contract.fees();
      return {
        basicFee: ethers.utils.formatEther(result.basicFee),
        advancedFee: ethers.utils.formatEther(result.advancedFee),
        verificationFee: ethers.utils.formatEther(result.verificationFee)
      };
    } catch (error) {
      console.error('Error getting fees:', error);
      throw error;
    }
  };

  return {
    contract,
    loading,
    submitValuation,
    getCurrentValuation,
    getValuationHistory,
    getCollectionStats,
    isAuthorizedValuator,
    getTotalValuations,
    getValuatorReputation,
    getFees
  };
};