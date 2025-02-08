import { ethers } from "ethers";

export const PRIDE_CONTRACT_ADDRESS =
  "0xF8BA218bb92CEfd12eDa293245083283B1B60f7a";
export const CROFAM_TOKEN_ADDRESS =
  "0x04632bA88Ae963a21A3E07781eC5BF07223e2cbF";
export const REQUIRED_CHAIN_ID = 25;

export const PRIDE_ABI = [
  "function totalSupply() view returns (uint256)",
  "function croMint(uint256 _mintAmount) payable",
  "function croFamMint(uint256 _mintAmount)",
  "function croPrice() view returns (uint256)",
  "function croFamPrice() view returns (uint256)",
  "function paused() view returns (bool)",
  "function croMaxSupply() view returns (uint256)",
  "function croFamMaxSupply() view returns (uint256)",
  "function croSupply() view returns (uint256)",
  "function croFamSupply() view returns (uint256)",
  "function isWhitelisted(address user) view returns(bool)",
];

export const CROFAM_TOKEN_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const initializeWeb3 = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    return { provider, chainId: network.chainId };
  }
  return null;
};

export const connectWallet = async (provider) => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await provider.listAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error("Connection error:", error);
    return null;
  }
};

export const switchToRequiredNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x19" }],
    });
    return true;
  } catch (error) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x19",
              chainName: "Cronos Mainnet",
              nativeCurrency: {
                name: "CRO",
                symbol: "CRO",
                decimals: 18,
              },
              rpcUrls: ["https://evm.cronos.org"],
              blockExplorerUrls: ["https://cronoscan.com/"],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Error adding network:", addError);
        return false;
      }
    }
    console.error("Error switching network:", error);
    return false;
  }
};
