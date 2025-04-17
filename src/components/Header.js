import React from 'react';
import { Wallet, ExternalLink } from 'lucide-react';

export default function Header({ 
  account, 
  isWrongNetwork, 
  switchNetwork, 
  connectWallet, 
  isDropdownOpen, 
  setIsDropdownOpen,
  croBalance,
  cryBalance,
  handleDisconnect 
}) {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="https://www.thepride.fun/" target="_blank" rel="noopener noreferrer">
              <button className="bg-orange-500 p-1 rounded-lg hover:bg-orange-600 transition-colors duration-200">
                <img 
                  src="https://crofam-token.com/wp-content/uploads/2024/04/crofam_logo-2-300x93.png"
                  alt="Logo"
                  className="w-16 h-8 md:w-15 md:h-10"
                />
              </button>
            </a>
            <span className="text-lg md:text-xl font-bold">CROFAM MINT</span>
          </div>
          
          <div className="relative">
            {isWrongNetwork ? (
              <button
                onClick={switchNetwork}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Switch to Cronos
              </button>
            ) : account ? (
              <div className="relative wallet-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Wallet size={20} />
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">CRO Balance</p>
                        <p className="font-bold">{Number(croBalance).toFixed(2)} CRO</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">CRY Balance</p>
                        <p className="font-bold">{Number(cryBalance).toFixed(2)} CRY</p>
                      </div>
                      <hr className="border-gray-700" />
                      <a
                        href={`https://cronoscan.com/address/${account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-orange-500 hover:text-orange-400"
                      >
                        View on Explorer <ExternalLink size={16} className="ml-2" />
                      </a>
                      <button
                        onClick={handleDisconnect}
                        className="w-full text-left text-red-500 hover:text-red-400"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Wallet size={20} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
