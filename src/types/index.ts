export interface NFTValuation {
  contractAddress: string;
  tokenId: string;
  estimatedValue: string;
  rarityScore: string;
  rarityRank: string;
  timestamp: string;
  valuator: string;
  isVerified: boolean;
  methodology: string;
  confidence: string;
}

export interface CollectionStats {
  totalSupply: string;
  floorPrice: string;
  averagePrice: string;
  totalVolume: string;
  holderCount: string;
  lastUpdated: string;
  isActive: boolean;
}

export interface RarityTrait {
  traitType: string;
  traitValue: string;
  frequency: string;
  rarityScore: string;
}

export interface ValuationFee {
  basicFee: string;
  advancedFee: string;
  verificationFee: string;
}