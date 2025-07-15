# NFT Rarity and Valuation Engine

A comprehensive Web3 application for AI-powered NFT rarity analysis and valuation using blockchain technology.

## Features

- **Smart Contract Integration**: Secure on-chain valuation storage with the NFTValuationOracle contract
- **AI-Powered Analysis**: Advanced algorithms for rarity scoring and price prediction
- **Real-time Data**: Live market data integration for accurate valuations
- **User Dashboard**: Comprehensive analytics and portfolio tracking
- **Wallet Integration**: Seamless Web3 wallet connectivity
- **Responsive Design**: Mobile-first UI with modern aesthetics

## Architecture

### Smart Contract
- **NFTValuationOracle.sol**: Core contract for storing valuations and rarity data
- **Features**: Authorized valuators, reputation system, fee structure, batch operations
- **Security**: OpenZeppelin contracts, ReentrancyGuard, Pausable functionality

### Frontend
- **React + TypeScript**: Modern component-based architecture
- **Tailwind CSS**: Utility-first styling with responsive design
- **Web3 Integration**: Ethers.js for blockchain interactions
- **Charts**: Recharts for data visualization

### Key Components
- **ValuationForm**: Submit new NFT valuations
- **ValuationDisplay**: Search and view NFT valuations
- **Dashboard**: Analytics and user statistics
- **Web3 Hooks**: Custom hooks for wallet and contract interactions

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Connect Wallet**
   - Install MetaMask or compatible Web3 wallet
   - Connect to supported network (Ethereum, Polygon, etc.)

4. **Deploy Contract** (Optional)
   - Deploy NFTValuationOracle.sol to your chosen network
   - Update contract address in `src/utils/contracts.ts`

## Contract Functions

### Core Functions
- `submitValuation()`: Submit NFT valuation with rarity analysis
- `getCurrentValuation()`: Get latest valuation for an NFT
- `getValuationHistory()`: Retrieve historical valuations
- `updateCollectionStats()`: Update collection-wide statistics

### Admin Functions
- `authorizeValuator()`: Add authorized valuator
- `verifyValuation()`: Verify submitted valuations
- `updateFees()`: Modify platform fees

### Query Functions
- `getCollectionStats()`: Get collection statistics
- `getValuatorReputation()`: Check valuator reputation
- `getTotalValuations()`: Get total platform valuations

## Technology Stack

- **Blockchain**: Ethereum, Polygon (multi-chain support)
- **Smart Contracts**: Solidity, OpenZeppelin
- **Frontend**: React, TypeScript, Tailwind CSS
- **Web3**: Ethers.js, Web3React
- **Build Tool**: Vite
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Security Features

- **Access Control**: Role-based permissions for valuators
- **Reentrancy Protection**: OpenZeppelin ReentrancyGuard
- **Emergency Controls**: Pausable functionality
- **Fee Structure**: Configurable fee system
- **Reputation System**: Track valuator performance

## Future Enhancements

- **Multi-chain Support**: Expand to additional blockchain networks
- **Advanced Analytics**: Machine learning integration
- **API Integration**: External NFT marketplace data
- **Mobile App**: React Native mobile application
- **DAO Governance**: Decentralized platform governance

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## License

MIT License - see LICENSE file for details