import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function MintSection({
  mintAmount,
  setMintAmount,
  account,
  croPrice,
  cryPrice,
  isLoading,
  isPaused,
  isWrongNetwork,
  mintWithCRO,
  mintWithCRY
}) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Mint Amount</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
              className="bg-gray-600 hover:bg-gray-500 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              -
            </button>
            <span className="text-xl font-bold w-8 text-center">{mintAmount}</span>
            <button
              onClick={() => setMintAmount(Math.min(25, mintAmount + 1))}
              className="bg-gray-600 hover:bg-gray-500 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>
        
        {account && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Cost CRO</p>
              <p className="font-medium">{(Number(croPrice) * mintAmount).toFixed(2)} CRO</p>
            </div>
            <div>
              <p className="text-gray-400">Total Cost CRY</p>
              <p className="font-medium">{(Number(cryPrice) * mintAmount).toFixed(2)} CRY</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={mintWithCRO}
          disabled={isLoading || isPaused || !account || isWrongNetwork}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          {isLoading ? 'Minting...' : 'Mint with CRO'}
        </button>
        <button
          onClick={mintWithCRY}
          disabled={isLoading || isPaused || !account || isWrongNetwork}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          {isLoading ? 'Minting...' : 'Mint with CRY'}
        </button>
      </div>
    </div>
  );
}