import { useEffect } from "react";
import {
  hooks,
  walletConnect,
} from "../../../WalletHelpers/connectors/walletConnect";
import { Accounts } from "../Accounts";
import { Status } from "../Status";
import ConnectWithSelect from "../ConnectWithSelect";

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

export default function WalletConnectCard() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  const ENSNames = useENSNames(provider);

  useEffect(() => {
    void walletConnect.connectEagerly();
  }, []);

  return (
    <ConnectWithSelect
      connector={walletConnect}
      chainId={chainId}
      isActivating={isActivating}
      error={error}
      isActive={isActive}
      wallet="walletConnect"
    />
  );
}
