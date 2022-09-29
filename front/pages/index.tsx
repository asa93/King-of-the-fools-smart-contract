import type { NextPage } from "next";
import { useEffect, useState } from "react";

import styles from "./mint.module.scss";
import { useWeb3React } from "@web3-react/core";
import ConnectWallet from "../components/ConnectWallet/ConnectWallet";
import Separator from "../components/Separator/Separator";
import { Spinner } from "react-bootstrap";
import contractABI from "../WalletHelpers/contractAbi.json";

import { provider } from "../WalletHelpers/contractVariables";
import { BigNumber, ethers } from "ethers";

import { Button, Card, CardContent } from "@mui/material";

const Deposit: NextPage = () => {
  const [confirmation, setConfirmation] = useState<boolean>(false);

  const [isFiat, setIsFiat] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { account, provider, chainId } = useWeb3React();
  const [chestContract, setChestContract] = useState<ethers.Contract>();
  const [lastDeposit, setLastDeposit] = useState<BigNumber>();

  useEffect(() => {
    (async () => {
      if (!provider) return;

      let contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS as string,
        contractABI,
        provider.getSigner()
      );

      setChestContract(contract);
      setLastDeposit(await contract.lastDeposit());
    })();
  }, [provider, chainId]);

  const depositETH = async () => {
    try {
      await chestContract?.deposit({ value: ethers.utils.parseEther("1") });
    } catch (e) {
      console.log("[ERROR]", e);
    }
  };
  return (
    <>
      <div className={styles.container}>
        {/* LOADER */}
        {loading && (
          <div>
            <div>
              <Spinner animation="border" style={{ color: "white" }} />
            </div>
          </div>
        )}

        <div>
          <h1>King Of The Fools</h1>
        </div>

        {account && (
          <Card>
            <CardContent>
              <p>{account}</p>
              <p>
                <strong>{lastDeposit?.toNumber()}</strong> ETH deposited
              </p>
              <div>
                <Button onClick={depositETH} variant="outlined">
                  Deposit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {!!!account && !loading && (
          <div className={styles.choice}>
            <div style={{ textAlign: "center" }}>
              <div></div>
            </div>

            <div className={styles.selection}>
              <Card>
                <CardContent className={styles.body}>
                  <img
                    style={{ width: "31px", marginBottom: "20px" }}
                    src="./eth.png"
                    alt=""
                  />
                  <h3>Connect your wallet first.</h3>
                  {/* <Card.Text>Price : 0.35 eth</Card.Text> */}
                  <ConnectWallet />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Deposit;
