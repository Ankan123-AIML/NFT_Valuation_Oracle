import React, { useState } from 'react';
import { Search, Clock, Shield, TrendingUp, Star, ChevronDown } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { NFTValuation } from '../types';
import toast from 'react-hot-toast';

export const ValuationDisplay: React.FC = () => {
  const { getCurrentValuation, getValuationHistory, loading } = useContract();
  const [searchData, setSearchData] = useState({
    contractAddress: '',
    tokenId: ''
  });
  const [currentValuation, setCurrentValuation] = useState<NFTValuation | null>(null);
  const [history, setHistory] = useState<NFTValuation[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const valuation = await getCurrentValuation(searchData.contractAddress, searchData.tokenId);
      setCurrentValuation(valuation);
      
      const valuationHistory = await getValuationHistory(searchData.contractAddress, searchData.tokenId);
      setHistory(valuationHistory);
      
      toast.success('Valuation data retrieved successfully');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      setCurrentValuation(null);
      setHistory([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  const getConfidenceColor = (confidence: string) => {
    const conf = parseInt(confidence);
    if (conf >= 90) return 'text-green-600 bg-green-50';
    if (conf >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRarityColor = (rarityScore: string) => {
    const score = parseFloat(rarityScore);
    if (score >= 90) return 'text-purple-600 bg-purple-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">NFT Valuation Lookup</h2>
          <p className="text-sm text-gray-500">Search for NFT valuations and rarity data</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Address
            </label>
            <input
              type="text"
              name="contractAddress"
              value={searchData.contractAddress}
              onChange={handleChange}
              placeholder="0x..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token ID
            </label>
            <input
              type="number"
              name="tokenId"
              value={searchData.tokenId}
              onChange={handleChange}
              placeholder="1234"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          <Search className="w-5 h-5" />
          <span>{loading ? 'Searching...' : 'Search Valuation'}</span>
        </button>
      </form>

      {currentValuation && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Valuation</h3>
              <div className="flex items-center space-x-2">
                {currentValuation.isVerified && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(currentValuation.confidence)}`}>
                  <Star className="w-3 h-3" />
                  <span>{currentValuation.confidence}% Confidence</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Estimated Value</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentValuation.estimatedValue} ETH</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Rarity Score</span>
                </div>
                <div className={`text-2xl font-bold ${getRarityColor(currentValuation.rarityScore).split(' ')[0]}`}>
                  {currentValuation.rarityScore}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Rank</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">#{currentValuation.rarityRank}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Methodology: {currentValuation.methodology}</span>
                <span>Last Updated: {formatTimestamp(currentValuation.timestamp)}</span>
              </div>
            </div>
          </div>

          {history.length > 1 && (
            <div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                <span>View History ({history.length} valuations)</span>
              </button>

              {showHistory && (
                <div className="mt-4 space-y-3">
                  {history.slice(0, -1).reverse().map((valuation, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{valuation.estimatedValue} ETH</span>
                        <span className="text-xs text-gray-500">{formatTimestamp(valuation.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Rarity: {valuation.rarityScore}</span>
                        <span>Rank: #{valuation.rarityRank}</span>
                        <span>Confidence: {valuation.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};