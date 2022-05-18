## Chainlink VRF 
*💾Chainlink VRF:* Chainlink VRF is used for generating random numbers in slot-machine game.


https://github.com/jaydippatel83/Game_station/blob/master/src/components/modal/Modal.js

```javascript
Smart Contract: 

/ SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
contract RandomNumberGenerator is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    uint256 public maxRange;
    constructor(address VRFCoordinator, address LINKToken, bytes32 KeyHash)
        VRFConsumerBase(
            VRFCoordinator, // VRF Coordinator
            LINKToken  // LINK Token
        ) public
    {
        keyHash = KeyHash;
        fee = 0.0001 * 10 ** 18; // 0.0001 LINK
    }
    /**
     * Requests randomness
     */
    function getRandomNumber(uint256 maxValue) public returns (bytes32 requestId) {
        maxRange = maxValue;
        require(LINK.balanceOf(address(this)) > fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }
    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        bytes32 i = requestId;
        i = requestId;
        randomResult = (randomness % maxRange) + 1;
    }
    function getRandom() public view returns (uint256) {
        uint256 numb = (randomResult % maxRange) + 1;
        return numb;
    }
}



```


```javascript
async function caller() {
    await randomNumContract.getRandomNumber(reels[0].length - 1);
    const randNo = await randomNumContract.getRandom();
    console.log(parseInt(randNo._hex, 16));
    setRandomNumber(parseInt(randNo._hex, 16));
  }
  async function loadBlockchainData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const randomNumber = new ethers.Contract(
      RandomNumberGeneratorContract,
      RandomNumberGenerator.abi,
      signer
    );
    setRandomNumContract(randomNumber);
    console.log(randomNumber);
  }




```

# Harmony : Tokenize non fungible assets and store them on Harmony Blockchain.

https://github.com/jaydippatel83/hackerhouse/blob/master/hardhat.config.js



```javascript

require("@nomiclabs/hardhat-waffle"); 
const HARMONY_PRIVATE_KEY = process.env.REACT_APP_HARMONY_PRIVATE_KEY;
module.exports = {
  solidity: "0.8.4",
  networks: { 
    harmony: {
      url: `https://api.s0.b.hmny.io`,
      accounts: [HARMONY_PRIVATE_KEY]
    }, 
  },
};

```
https://github.com/jaydippatel83/hackerhouse/blob/master/src/components/modal/SendGift.js

```javascript
useEffect(async () => {
    query.equalTo("tokenId", props.data.saveData.tokenId);
    const dd = await query.find();
    const getAmount = JSON.parse(JSON.stringify(dd));
    setPostData(getAmount);
    const hmy = new Harmony("https://api.s0.b.hmny.io/", { 
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyTestnet,
    });  
    const add = converter('one').toBech32( user && user.attributes.ethAddress);
    hmy.blockchain
      .getBalance({ address: add})
      .then((response) => {
        console.log(
          "balance in ONEs: " + fromWei(hexToNumber(response.result), Units.one)
        );
        setBal(fromWei(hexToNumber(response.result), Units.one));
      }); 
    const opt = { chain: "ropsten", address: user.attributes.account };
    const tmetadata = Moralis.Web3.getAllERC20(opt).then((res) => {
      setEth(ethers.utils.formatUnits(res[0].balance, 18));
    });
  }, [user]);
```
# IPFS  : Data of all the a) reward based NFT games, b) contests and c) user's post NFT are stored NFT Metadata on IPFS.
https://github.com/jaydippatel83/hackerhouse/blob/master/src/components/modal/Modal.js

```javascript
const file = new Moralis.File("data.json", { base64: btoa(JSON.stringify(data)) });
const dataUri = await file.saveIPFS();
const uri = dataUri._ipfs;
```
# Covalent :  Fatch NFT data with chainid and contract address
               a) User NFT posts d) Contest NFT Transactions 
              b) Memory Game NFTs: In this game user can earn NFTs by playing memory power game and chance to get and airdrops
             c) Lottery NFTs: Here we used covalent to retrieve all the lucky lottery NFTs user won. 
    
https://github.com/jaydippatel83/hackerhouse/blob/master/src/components/mintedNft/mintedNft.js

```javascript
const covalent = Moralis.Plugins.covalent;
    async function getMintedNft() { 
        const ids = [...tokenid]; 
        const result = await axios.get(`https://api.covalenthq.com/v1/1666700000/tokens/${tokenAddres}/transactions_v2/?key=ckey_d6812b57760b43418ee399bdf1d`); 
        console.log(result);
        const dd = result.data.items && result.data.items.map(async (e) => {
            ids.push(e.token_id); 
        })
        setTokenid(ids);
    }
    useEffect(() => {
        Moralis.initPlugins();
        getMintedNft();
    }, []);

```



