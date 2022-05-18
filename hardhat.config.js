require("@nomiclabs/hardhat-waffle"); 
require("dotenv").config({ path: "./.env" });

const pk_1 = process.env.REACT_APP_BOBA_PRIVATE_KEY_1;

module.exports = {
  solidity: "0.8.4",
  networks: {
    boba_rinkeby: {
      url: `https://rinkeby.boba.network`,
      accounts: [pk_1],
    }
  },
};

