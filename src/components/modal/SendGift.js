import React, { useEffect, useState } from "react";
import { List, TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import {
  useNewMoralisObject,
  useMoralisCloudFunction,
  useMoralis,
} from "react-moralis";
import { socialAddress } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import Load from "../Load";
import { BigNumber, ethers } from "ethers";
import { Harmony } from "@harmony-js/core";
import {
  ChainID,
  ChainType,
  hexToNumber,
  numberToHex,
  fromWei,
  Units,
  Unit,isBech32Address
} from "@harmony-js/utils";
import Web3 from "web3";
import converter from "bech32-converting"

function SendGift(props) {
  const [show, setShow] = useState(false);
  const { Moralis, user } = useMoralis();
  const { isSaving, save, error } = useNewMoralisObject("GiftData");
  // const { data, isLoading } = useMoralisCloudFunction("getGiftData");
  const [amount, setAmaount] = useState();
  const [gift, setGift] = useState([]);
  const [postData, setPostData] = useState();
  const [post, setPost] = useState([]);
  const [bal, setBal] = useState();
  const [eth, setEth] = useState();
  const [isUpdated, setIsupdated] = useState(false);

  const Gifts = Moralis.Object.extend("GiftData");
  const query = new Moralis.Query(Gifts);
  const gifts = new Gifts();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(async () => {
    query.equalTo("tokenId", props.data.saveData.tokenId);
    const dd = await query.find();
    const getAmount = JSON.parse(JSON.stringify(dd));
    setPostData(getAmount); 
    
     
      let web3 = new Web3("https://rinkeby.boba.network");
      let addr = web3.utils.toChecksumAddress(user && user.attributes.ethAddress);
      let balance = await web3.eth.getBalance(user && user.attributes.ethAddress);
      setBal(ethers.utils.formatUnits(balance, 18));

    const add = converter('one').toBech32( user && user.attributes.ethAddress); 
     
    const opt = { chain: "ropsten", address: user.attributes.account };
    const tmetadata = Moralis.Web3.getAllERC20(opt).then((res) => {
      setEth(ethers.utils.formatUnits(res[0].balance, 18));
    });
  }, [user]);

  useEffect(() => {
    let total =
      postData != undefined &&
      postData.reduce(function (prev, current) {
        return prev + +ethers.utils.formatUnits(current.amount, 18);
      }, 0);
    setGift(total);
  }, [postData, isUpdated]);

  const handleTransfer = async () => {
    await Moralis.enableWeb3();
    const options = {
      type: "native",
      amount: Moralis.Units.ETH(amount, "18"),
      receiver: props.data.saveData.address,
      contractAddress: socialAddress,
    };
    let result = await Moralis.transfer(options);

    gifts.set("from", result.from);
    gifts.set("to", result.to);
    gifts.set("amount", result.value);
    gifts.set("tokenId", props.data.saveData.tokenId);
    gifts.set("postId", props.data.objectId);
    gifts.set("transactionHash", result.hash);
    gifts.set("user", user);
    await gifts.save().then(
      (monster) => {
        toast.success("Successfully Gifted!", monster.message);
      },
      (error) => {
        toast.error(error.message);
      }
    );
    setShow(false);
    setIsupdated(!isUpdated);
  };

  useEffect(() => {}, [isUpdated]);

  return (
    <div className="pointer ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss ">
      <ToastContainer />
      <div onClick={handleShow} className="d-flex">
        <i className="feather-gift text-grey-900 text-dark btn-round-sm font-lg"></i>
        <span className="d-none-xs align-self-center">Buy me a Coffee </span>
        <span className="text-success mx-2 align-self-center">
          {parseFloat(gift).toFixed(2)} BOBA
        </span>
      </div>
      <Modal show={show} onHide={handleClose}>
        {/*  behind */}
        <Modal.Header className="theme-dark-bg" closeButton>
          <Modal.Title className="h4" style={{ fontWeight: "600" }}>
            Send Gifts
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="theme-dark-bg" style={{ padding: "0" }}>
          <List
            sx={{
              width: "100%",
              padding: "10px 0px",
              bgcolor: "background.paper",
              overflowX: "hidden",
            }}
            className="theme-dark-bg"
          >
            <div className="root"></div>
            <div className="text-success fw-700 p-2">
              <h4>
                <span className="fw-700">BOBA Balance : </span>{" "}
                <img
                  width={20}
                  height={20}
                  src="https://boba.network/wp-content/uploads/2022/01/Boba-Token-Hero-New-5-1536x1536.png"
                />
                <span className="fw-700 text-primary mx-2 h4">
                  {parseFloat(bal).toFixed(2)}{" "}
                </span>{" "}
                <span className="fw-700 text-primary">BOBA </span>
              </h4>
            </div>
            <div className="text-success fw-700 p-2">
              <h4>
                <span className="fw-700">ETH Balance : </span>{" "}
                <img width={20} height={20} src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" />
                <span className="fw-700 text-primary mx-2 h4">
                  {parseFloat(eth).toFixed(2)}{" "}
                </span>{" "}
                <span className="fw-700 text-primary">ETH </span>
              </h4>
            </div>
            <div className="">
              <div className="form-group icon-input   p-2">
                <input
                  onChange={(e) => setAmaount(e.target.value)}
                  type="number"
                  className="h4 bor-0 w-100 rounded-xxl p-3    font-xsss fw-600 border-light-md card"
                  placeholder="Enter Amount"
                />
              </div>
            </div>
          </List>
        </Modal.Body>
        <Modal.Footer className="theme-dark-bg">
          <button className="btn btn-danger" onClick={handleClose}>
            Close
          </button>
          <button
            style={{ border: "none" }}
            className="p-2  bg-primary-gradiant  me-2 text-white text-center font-xssss fw-600 ls-1 rounded border-none"
            onClick={handleTransfer}
          >
            Gift BOBA
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SendGift;
