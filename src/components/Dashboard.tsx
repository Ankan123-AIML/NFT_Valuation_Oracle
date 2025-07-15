import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, TrendingUp, Users, Award, DollarSign, Zap } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../hooks/useWeb3';

export const Dashboard: React.FC = () => {
  const { account, isConnected } = useWeb3();
  const { getTotalValuations, getValuatorReputation, getFees } = useContract();
  const [stats, setStats] = useState({
    totalValuations: '0',
    userReputation: '0',
    basicFee: '0',
    advancedFee: '0',
    verificationFee: '0'
  });

  useEffect(() => {
    if (isConnected && account) {
      loadDashboardData();
    }
  }, [isConnected, account]);

  const loadDashboardData = async () => {
    try {
      const [totalValuations, userReputation, fees] = await Promise.all([
        getTotalValuations(),
        getValuatorReputation(account!),
        getFees()
      ]);

      setStats({
        totalValuations,
        userReputation,
        basicFee: fees.basicFee,
        advancedFee: fees.advancedFee,
        verificationFee: fees.verificationFee
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const mockChartData = [
    { name: 'Jan', valuations: 4000, volume: 2400 },
    { name: 'Feb', valuations: 3000, volume: 1398 },
    { name: 'Mar', valuations: 2000, volume: 9800 },
    { name: 'Apr', valuations: 2780, volume: 3908 },
    { name: 'May', valuations: 1890, volume: 4800 },
    { name: 'Jun', valuations: 2390, volume: 3800 },
  ];

  const mockRarityData = [
    { name: 'Common', count: 5000, percentage: 50 },
    { name: 'Uncommon', count: 3000, percentage: 30 },
    { name: 'Rare', count: 1500, percentage: 15 },
    { name: 'Epic', count: 400, percentage: 4 },
    { name: 'Legendary', count: 100, percentage: 1 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              +{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600">Please connect your wallet to view the dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Valuations"
          value={stats.totalValuations}
          icon={Activity}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          change="12"
        />
        <StatCard
          title="Your Reputation"
          value={stats.userReputation}
          icon={Award}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          change="5"
        />
        <StatCard
          title="Basic Fee"
          value={`${stats.basicFee} ETH`}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Platform Usage"
          value="Active"
          icon={Zap}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          change="8"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Valuation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valuations" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rarity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockRarityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Valuation Submitted', item: 'CryptoPunk #1234', time: '2 minutes ago', status: 'success' },
            { action: 'Valuation Verified', item: 'Bored Ape #5678', time: '1 hour ago', status: 'verified' },
            { action: 'Collection Added', item: 'Azuki Collection', time: '3 hours ago', status: 'info' },
            { action: 'Rarity Updated', item: 'Doodles #9012', time: '5 hours ago', status: 'warning' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'verified' ? 'bg-blue-500' :
                activity.status === 'info' ? 'bg-purple-500' :
                'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.item}</p>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};