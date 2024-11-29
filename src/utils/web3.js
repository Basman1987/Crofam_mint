import { ethers } from 'ethers';

export const MONSTERS_CONTRACT_ADDRESS = "0xc73E9b57f8678C1dd20879fc19369BBC15c62Df3";
export const CRY_TOKEN_ADDRESS = "0xB770074eA2A8325440798fDF1c29B235b31922Ae";
export const REQUIRED_CHAIN_ID = 25;

export const MONSTERS_ABI = [
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

export const CRY_TOKEN_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export const initializeWeb3 = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    return { provider, chainId: network.chainId };
  }
  return null;
};

export const connectWallet = async (provider) => {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await provider.listAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error('Connection error:', error);
    return null;
  }
};

export const switchToRequiredNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x19' }],
    });
    return true;
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
        return true;
      } catch (addError) {
        console.error('Error adding network:', addError);
        return false;
      }
    }
    console.error('Error switching network:', error);
    return false;
  }
};