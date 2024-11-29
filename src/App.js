import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import { Wallet, ExternalLink } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const MeltedMonsterStyle = () => (
  <style>
    @import url('https://fonts.cdnfonts.com/css/melted-monster');
  </style>
);
const vegan = () => (
<style>
@import url('https://fonts.cdnfonts.com/css/vegan-abattoir');
</style>
);

const MONSTERS_CONTRACT_ADDRESS = "0xc73E9b57f8678C1dd20879fc19369BBC15c62Df3";
const CRY_TOKEN_ADDRESS = "0xB770074eA2A8325440798fDF1c29B235b31922Ae";
const REQUIRED_CHAIN_ID = 25;

const MONSTERS_ABI = [
  "function totalSupply() view returns (uint256)",
  "function croCrazzzyMint(uint256 _mintAmount) payable",
  "function cryCrazzzyMint(uint256 _mintAmount)",
  "function croPrice() view returns (uint256)",
  "function cryPrice() view returns (uint256)",
  "function paused() view returns (bool)",
  "function marketingAmount() view returns (uint256)",
  "function croCrazzzyAmount() view returns (uint256)",
  "function cryCrazzzyAmount() view returns (uint256)",
  "function croCrazzzySupply() view returns (uint256)",
  "function cryCrazzzySupply() view returns (uint256)"
];

const CRY_TOKEN_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [cryToken, setCryToken] = useState(null);
  const [account, setAccount] = useState('');
  // eslint-disable-next-line
  const [chainId, setChainId] = useState(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [totalMinted, setTotalMinted] = useState(0);
  const [croPrice, setCroPrice] = useState('0');
  const [cryPrice, setCryPrice] = useState('0');
  const [isPaused, setIsPaused] = useState(true);
  const [mintAmount, setMintAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [croMinted, setCroMinted] = useState(0);
  const [cryMinted, setCryMinted] = useState(0);
  const [maxCroMint, setMaxCroMint] = useState(0);
  const [maxCryMint, setMaxCryMint] = useState(0);

  const [croBalance, setCroBalance] = useState('0');
  const [cryBalance, setCryBalance] = useState('0');

  useEffect(() => {
    initializeWeb3();
    return () => {
      removeWeb3Listeners();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (account && provider) {
      updateBalances();
      const interval = setInterval(updateBalances, 10000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [account, provider]);

  const initializeWeb3 = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('disconnect', handleDisconnect);

        const network = await provider.getNetwork();
        setChainId(network.chainId);
        setIsWrongNetwork(network.chainId !== REQUIRED_CHAIN_ID);

        handleDisconnect(false);
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Failed to initialize Web3');
      }
    }
  };

  const removeWeb3Listeners = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      await updateSignerAndContracts(accounts[0]);
    } else {
      handleDisconnect();
    }
  };

  const handleChainChanged = (newChainId) => {
    setChainId(parseInt(newChainId));
    setIsWrongNetwork(parseInt(newChainId) !== REQUIRED_CHAIN_ID);
    window.location.reload();
  };

  const handleDisconnect = (showNotification = true) => {
    setAccount('');
    setSigner(null);
    setContract(null);
    setCryToken(null);
    if (showNotification) {
      toast.info('Wallet disconnected');
    }
  };

  const updateSignerAndContracts = async (account) => {
    if (provider && account) {
      try {
        const signer = provider.getSigner();
        setSigner(signer);

        const monstersContract = new ethers.Contract(
          MONSTERS_CONTRACT_ADDRESS,
          MONSTERS_ABI,
          signer
        );
        setContract(monstersContract);

        const cryTokenContract = new ethers.Contract(
          CRY_TOKEN_ADDRESS,
          CRY_TOKEN_ABI,
          signer
        );
        setCryToken(cryTokenContract);

        await loadContractData(monstersContract);
        await updateBalances();
      } catch (error) {
        console.error('Error updating contracts:', error);
        toast.error('Failed to update contract connection');
      }
    }
  };

  const updateBalances = async () => {
    if (provider && account) {
      try {
        const [croBalanceWei, cryBalanceWei] = await Promise.all([
          provider.getBalance(account),
          cryToken.balanceOf(account)
        ]);
        
        setCroBalance(ethers.utils.formatEther(croBalanceWei));
        setCryBalance(ethers.utils.formatEther(cryBalanceWei));
      } catch (error) {
        console.error('Error updating balances:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          await handleAccountsChanged(accounts);
          toast.success('Wallet connected!');
        }
      } catch (error) {
        console.error('Connection error:', error);
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('Please install MetaMask');
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x19' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x19',
              chainName: 'Cronos Mainnet',
              nativeCurrency: {
                name: 'CRO',
                symbol: 'CRO',
                decimals: 18
              },
              rpcUrls: ['https://evm.cronos.org'],
              blockExplorerUrls: ['https://cronoscan.com/']
            }]
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error('Failed to add Cronos network');
        }
      } else {
        console.error('Error switching network:', error);
        toast.error('Failed to switch network');
      }
    }
  };

  const loadContractData = async (contract) => {
    try {
      const [
        totalSupply,
        currentCroPrice,
        currentCryPrice,
        currentPaused,
        croCrazzzySupply,
        cryCrazzzySupply,
        croCrazzzyAmount,
        cryCrazzzyAmount
      ] = await Promise.all([
        contract.totalSupply(),
        contract.croPrice(),
        contract.cryPrice(),
        contract.paused(),
        contract.croCrazzzySupply(),
        contract.cryCrazzzySupply(),
        contract.croCrazzzyAmount(),
        contract.cryCrazzzyAmount()
      ]);

      setTotalMinted(totalSupply.toNumber());
      setCroPrice(ethers.utils.formatEther(currentCroPrice));
      setCryPrice(ethers.utils.formatEther(currentCryPrice));
      setIsPaused(currentPaused);
      setCroMinted(croCrazzzySupply.toNumber());
      setCryMinted(cryCrazzzySupply.toNumber());
      setMaxCroMint(croCrazzzyAmount.toNumber());
      setMaxCryMint(cryCrazzzyAmount.toNumber());
    } catch (error) {
      console.error('Error loading contract data:', error);
      toast.error('Failed to load contract data');
    }
  };

  const mintWithCRO = async () => {
    if (!signer || !contract || isWrongNetwork) return;
    
    setIsLoading(true);
    try {
      const cost = ethers.utils.parseEther(croPrice).mul(mintAmount);
      
      const balance = await provider.getBalance(account);
      if (balance.lt(cost)) {
        toast.error('Insufficient CRO balance');
        return;
      }

      const gasEstimate = await contract.estimateGas.croCrazzzyMint(mintAmount, { value: cost });
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await contract.croCrazzzyMint(mintAmount, { 
        value: cost,
        gasLimit: gasLimit
      });
      
      toast.info('Transaction submitted. Waiting for confirmation...', {
        onClick: () => window.open(`https://cronoscan.com/tx/${tx.hash}`, '_blank')
      });
      
      await tx.wait();
      
      toast.success('NFTs minted successfully!', {
        onClick: () => window.open(`https://cronoscan.com/tx/${tx.hash}`, '_blank')
      });
      
      await Promise.all([
        loadContractData(contract),
        updateBalances()
      ]);
    } catch (error) {
      console.error('Minting error:', error);
      toast.error(error.reason || 'Failed to mint NFTs');
    }
    setIsLoading(false);
  };

  const mintWithCRY = async () => {
    if (!signer || !contract || !cryToken || isWrongNetwork) return;
    
    setIsLoading(true);
    try {
      const cost = ethers.utils.parseEther(cryPrice).mul(mintAmount);
      
      const balance = await cryToken.balanceOf(account);
      if (balance.lt(cost)) {
        toast.error('Insufficient CRY balance');
        return;
      }

      const allowance = await cryToken.allowance(account, MONSTERS_CONTRACT_ADDRESS);
      if (allowance.lt(cost)) {
        const approveGasEstimate = await cryToken.estimateGas.approve(MONSTERS_CONTRACT_ADDRESS, cost);
        const approveGasLimit = approveGasEstimate.mul(120).div(100);

        const approveTx = await cryToken.approve(MONSTERS_CONTRACT_ADDRESS, cost, {
          gasLimit: approveGasLimit
        });
        
        toast.info('Approving CRY tokens...', {
          onClick: () => window.open(`https://cronoscan.com/tx/${approveTx.hash}`, '_blank')
        });
        await approveTx.wait();
      }

      const gasEstimate = await contract.estimateGas.cryCrazzzyMint(mintAmount);
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await contract.cryCrazzzyMint(mintAmount, {
        gasLimit: gasLimit
      });
      
      toast.info('Transaction submitted. Waiting for confirmation...', {
        onClick: () => window.open(`https://cronoscan.com/tx/${tx.hash}`, '_blank')
      });
      
      await tx.wait();
      
      toast.success('NFTs minted successfully!', {
        onClick: () => window.open(`https://cronoscan.com/tx/${tx.hash}`, '_blank')
      });
      
      await Promise.all([
        loadContractData(contract),
        updateBalances()
      ]);
    } catch (error) {
      console.error('Minting error:', error);
      if (error.code === 'UNPREDICTABLE_GAS_LIMIT' || error.reason?.includes('gas')) {
        toast.error('Transaction may fail. Try reducing mint amount or contact support.');
      } else {
        toast.error(error.reason || 'Failed to mint NFTs');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MeltedMonsterStyle />
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="https://crofam-token.com" target="_blank" rel="noopener noreferrer">
                <button className="bg-blue-500 p-1 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  <img 
                    src="https://crofam-token.com/wp-content/uploads/2024/04/crofam_logo-2-300x93.png"
                    alt="Logo"
                    className="w-16 h-8 md:w-15 md:h-10"
                  />
                </button>
              </a>
              <span className="text-lg md:text-xl font-bold">CROFAM LIONS</span>
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

      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col lg:justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:min-h-[600px]">
          <div className="w-full h-full">
            <img
              src="/img/crofam.jpg"
              alt="NFT Preview"
              className="rounded-xl w-full h-full object-cover"
            />
          </div>
          
          
          <div className="flex flex-col justify-between space-y-6 lg:py-2">
              <h1 
                className="text-3xl md:text-3xl lg:text-4xl font-bold text-white text-center"
                style={{ 
                  font:vegan
                ,
                  lineHeight: '1.2',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                CROFAM MINT
              </h1>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Price</p>
                <p className="text-xl md:text-2xl font-bold">{croPrice} CRO</p>
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className={`text-xl md:text-2xl font-bold ${isPaused ? 'text-red-500' : 'text-green-500'}`}>
                  {isPaused ? 'Paused' : 'Active'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Total Minted</span>
                <span className="font-medium">{totalMinted}/10000</span>
              </div>
              <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-500 ease-in-out rounded-full"
                  style={{ width: `${(totalMinted / 10000) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">CRO Minted</p>
                  <p className="font-medium">{croMinted}/{maxCroMint}</p>
                </div>
                <div>
                  <p className="text-gray-400">CRY Minted</p>
                  <p className="font-medium">{cryMinted}/{maxCryMint}</p>
                </div>
              </div>
            </div>

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

            <div className="text-gray-400 text-sm p-4 bg-gray-700/50 rounded-xl">
              <p className="font-medium">Choose your preferred minting option:</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><span className="text-orange-500 font-semibold">CRO</span>: Mint using native Cronos tokens (CRO)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><span className="text-purple-500 font-semibold">CRY</span>: Mint using CRY tokens with special benefits</span>
                </li>
              </ul>
              <p className="mt-2 text-xs">Note: Make sure you have sufficient balance and approved tokens before minting.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 
            className="text-2xl md:text-2xl font-bold mb-6 text-white text-center"
            style={{ 
              fontFamily: "Vegan Abattoir', sans-serif",
              letterSpacing: '0.05em',
              lineHeight: '1.2',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            MINT DETAILS
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Price CRO</p>
              <p className="font-bold">{croPrice} CRO</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Price CRY</p>
              <p className="font-bold">{cryPrice} CRY</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Max Per Transaction</p>
              <p className="font-bold">25 NFTs</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Contract</p>
              <a
                href={`https://cronoscan.com/address/${MONSTERS_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 transition-colors flex items-center"
              >
                View on Explorer <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mt-6">
          <p className="text-gray-200 text-center text-lg max-w-4xl mx-auto leading-relaxed">
          Introducing 'Arcane Creatures,' the female counterparts to our original 'Crazzzy Monsters' collection. This second edition of 10,000 unique NFTs draws...
          </p>
              </div>
            </div>
          </main>

        <footer className="bg-gray-800 mt-8 py-8 border-t border-gray-700">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-bold mb-4">Join the Crazzzy Monsters adventure!</h3>
            <p className="text-gray-400">
              Built By <a 
              href="https://x.com/CrazzzyMonsters" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-orange-500 hover:text-orange-600 transition-colors"
              >
              CRAZZZY MONSTERS
              </a>
            </p>
            <div className="flex justify-center space-x-6 mt-6">
              <a
                href="https://discord.com/invite/YjYHgKNapj"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
              <a
                href="https://x.com/CrazzzyMonsters"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a
                href="https://crazzzymonsters.com/static/media/Policy.8820d95f7ec77e6dcc79.pdf"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </a>
            </div>
            <p className="text-gray-400 mt-6">© 2024 - Powered by Crazzzy Monsters</p>
          </div>
        </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
