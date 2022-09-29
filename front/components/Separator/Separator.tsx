import { useState, useEffect, FunctionComponent } from "react";
import { useWeb3React } from "@web3-react/core";
import { Spinner } from "react-bootstrap";
import styles from "../Separator/Separator.module.scss";
import Minter from "../Minter/Minter";
// import FiatMinter from "../FiatMinter/FiatMinter";
import contractABI from "../../WalletHelpers/TestFIN.json";
import {
  contractAddress,
  provider,
} from "../../WalletHelpers/contractVariables";
import { ethers } from "ethers";

import { GetMerkleProof, GetRoot } from "../merkle";

const Provider = new ethers.providers.JsonRpcProvider(provider);
const contract = new ethers.Contract(contractAddress, contractABI, Provider);
interface Props {
  isFiat: any;
}

const Separator: FunctionComponent<Props> = ({ isFiat }): JSX.Element => {
  const { account } = useWeb3React();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setIsActive(await contract.isActive());
      setLoading(false);
      //console.log(GetRoot());
    })();
  }, []);

  if (!!isActive) {
    return (
      <>
        {/* MINT IN ETH */}
        {!!account && <Minter title="PUBLIC" proof={GetMerkleProof(account)}/>}

        {/* MINT IN FIAT*/}
        {/* {!!isFiat && <FiatMinter />} */}
      </>
    );
  } else {
    return (
      <div>
        {loading ? (
          <div>
            <h1>
              <Spinner animation="border" />
            </h1>
          </div>
        ) : (
          <div className={styles.message}>
            <p>Unfortunately the public sale has not started</p>
            <h1>COME BACK FOR PUBLIC SALE</h1>
            <hr></hr>

            <h3>PUBLIC LAUNCH DATE</h3>
            <h3>JUNE 1 2022</h3>
            <hr></hr>

            <h3>JOIN OUR COMMUNITY </h3>
            <p>Receive all the news & exchange with the community</p>
            <a href="">Discord</a>
          </div>
        )}
      </div>
    );
  }
};

export default Separator;
