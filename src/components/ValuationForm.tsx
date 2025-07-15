import React, { useState } from 'react';
import { Send, Info } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../hooks/useWeb3';
import toast from 'react-hot-toast';

export const ValuationForm: React.FC = () => {
  const { isConnected } = useWeb3();
  const { submitValuation, loading } = useContract();
  const [formData, setFormData] = useState({
    contractAddress: '',
    tokenId: '',
    estimatedValue: '',
    rarityScore: '',
    rarityRank: '',
    methodology: 'AI-Powered Analysis',
    confidence: '85'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const txHash = await submitValuation(
        formData.contractAddress,
        formData.tokenId,
        formData.estimatedValue,
        formData.rarityScore,
        formData.rarityRank,
        formData.methodology,
        formData.confidence
      );
      
      toast.success(`Valuation submitted successfully! TX: ${txHash.slice(0, 10)}...`);
      
      // Reset form
      setFormData({
        contractAddress: '',
        tokenId: '',
        estimatedValue: '',
        rarityScore: '',
        rarityRank: '',
        methodology: 'AI-Powered Analysis',
        confidence: '85'
      });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <Send className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Submit NFT Valuation</h2>
          <p className="text-sm text-gray-500">Provide AI-powered rarity and valuation analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Address
            </label>
            <input
              type="text"
              name="contractAddress"
              value={formData.contractAddress}
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
              value={formData.tokenId}
              onChange={handleChange}
              placeholder="1234"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Value (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              name="estimatedValue"
              value={formData.estimatedValue}
              onChange={handleChange}
              placeholder="1.25"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rarity Score
            </label>
            <input
              type="number"
              step="0.01"
              name="rarityScore"
              value={formData.rarityScore}
              onChange={handleChange}
              placeholder="85.50"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rarity Rank
            </label>
            <input
              type="number"
              name="rarityRank"
              value={formData.rarityRank}
              onChange={handleChange}
              placeholder="1250"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Methodology
            </label>
            <select
              name="methodology"
              value={formData.methodology}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="AI-Powered Analysis">AI-Powered Analysis</option>
              <option value="Comparable Sales">Comparable Sales</option>
              <option value="Trait-Based Valuation">Trait-Based Valuation</option>
              <option value="Market Trend Analysis">Market Trend Analysis</option>
              <option value="Hybrid Model">Hybrid Model</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence Level ({formData.confidence}%)
          </label>
          <input
            type="range"
            name="confidence"
            min="60"
            max="100"
            value={formData.confidence}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low (60%)</span>
            <span>Medium (80%)</span>
            <span>High (100%)</span>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Submission Fee: 0.001 ETH</p>
            <p>Your valuation will be recorded on-chain and can be verified by the community. High-quality submissions increase your reputation score.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          <Send className="w-5 h-5" />
          <span>{loading ? 'Submitting...' : 'Submit Valuation'}</span>
        </button>
      </form>
    </div>
  );
};