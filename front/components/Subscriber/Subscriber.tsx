import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import {
  contractAddress,
  targetChainId,
  provider,
  openseaURL,
} from '../../WalletHelpers/contractVariables'
import contractABI from '../../WalletHelpers/TestFIN.json'

import Minter from '../Minter/Minter'

function Subscriber() {
  const [error, setError] = useState<string>('')
  const { account, provider, chainId } = useWeb3React()
  const [hash, setHash] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean>(false)
  const [raffleIsActive, setRaffleIsActive] = useState<boolean>(false)
  const [signer, setSigner] = useState<any>(null)
  const [contract, setContract] = useState<any>(null)
  const [subscriptionIsActive, setSubscriptionIsActive] = useState<boolean>(
    false,
  )
  const [refundAvailable, setRefundAvailable] = useState<boolean>(false)
  const [subscriptionFee, setSubscriptionFee] = useState<number>(0)
  const [nftPrice, setNftPrice] = useState<any>('')
  const [transactionReceipt, setTransactionReceipt] = useState<any>(null)
  const [isSubscribe, setIsSubscribe] = useState<boolean>(false)
  const openSeaLink = openseaURL + contractAddress + '/'

  useEffect(() => {
    if (!!provider && chainId == targetChainId) {
      const getSigner = provider.getSigner()
      setSigner(getSigner)
      setContract(new ethers.Contract(contractAddress, contractABI, getSigner))
    }
  }, [provider, chainId])

  useEffect(() => {
    if (!!account && !!contract) {
      ;(async () => {
        setIsActive(await contract.isActive())
        setRaffleIsActive(await contract.isRaffleActive())
        setNftPrice(await (await contract.NFTPrice()).toString())
        setSubscriptionIsActive(await contract.isSubscriptionOpen())
        setSubscriptionFee(await contract.subscriptionFee())
        setRefundAvailable(await contract.refundAvailable())
        setIsSubscribe(await contract.subscribedToRaffle(account))
        eventSubscriber()
      })()
    }
  }, [account, signer])

  function eventSubscriber() {
    contract.on('SubscriptionOpen', (event: any) => {
      setSubscriptionIsActive(event)
    })
    contract.on('RaffleOpen', (event: any) => {
      setRaffleIsActive(event)
    })
    contract.on('RefundAvailable', (event: any) => {
      setRefundAvailable(event)
    })
  }

  const confirmationMessage = () => {
    let nftLinks: string[] = []

    if (transactionReceipt) {
      if (transactionReceipt?.events.length > 1) {
        transactionReceipt?.events.map((values: any) => {
          const nftId = values.args?.tokenId.toString()
          nftLinks.push(openSeaLink + nftId)
        })
      } else {
        const nftId = transactionReceipt?.events[0]?.args.tokenId.toString()
        nftLinks = [openSeaLink + nftId]
      }
    }

    return (
      <div>
        <div>
          <div>
            <div>
              <p>YOU MADE IT.</p>
              <h1>CONGRATULATIONS & WELCOME TO THE CLUB</h1>
              <p>
                You can now see your NFT directly on Opensea, once again,
                welcome to the Wine Bottle Club.
              </p>
              {nftLinks.map((link, i) => {
                return (
                  <div key={link} style={{ marginBottom: '50px' }}>
                    <a
                      className="btn-white"
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      NFT {i + 1}
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  async function subscribeToRaffle() {
    if (!!account) {
      if (!subscriptionIsActive) {
        alert('raffle is not active or subscription is not active')
      } else {
        contract
          .subscribeToRaffle({ value: subscriptionFee.toString() })
          .then((res: any) => {
            setHash(res.hash)
            res
              .wait()
              .then(function (receipt: any) {
                //setTransactionReceipt(receipt);
                console.log('receipt: ', receipt)
                //setLoading(false);
              })
              .catch((error: any) => {
                setError(error.message)
                console.log('error', error)
                //setLoading(false);
              })
          })
          .catch((error: any) => {
            setError(error.message)
            console.log('error', error)
            //setLoading(false);
          })
      }
    }
  }

  async function claimFund() {
    if (!!account) {
      if (refundAvailable) {
        console.log('isSubscribe ? ', isSubscribe)
        contract
          .claimRefund() //{ value: subscriptionFee.toString() }
          .then((res: any) => {
            setHash(res.hash)
            res
              .wait()
              .then(function (receipt: any) {
                //setTransactionReceipt(receipt);
                console.log('receipt: ', receipt)
                //setLoading(false);
              })
              .catch((error: any) => {
                setError(error.message)
                console.log('error', error)
                //setLoading(false);
              })
          })
          .catch((error: any) => {
            setError(error.message)
            console.log('error', error)
            //setLoading(false);
          })
      }
    }
  }

  function mintNftRaffle() {
    const transactionParameters = {
      value: (1 * Number(nftPrice)).toString(),
    }

    contract
      .mintNFTDuringRaffle(1, transactionParameters) // test
      .then((res: any) => {
        setHash(res.hash)
        res
          .wait()
          .then(function (receipt: any) {
            setTransactionReceipt(receipt)
            console.log('receipt: ', receipt)
            //setLoading(false);
          })
          .catch((error: any) => {
            setError(error.message)
            console.log('error', error)
            //setLoading(false);
          })
      })
      .catch((error: any) => {
        setError(error.message)
        console.log('error', error)
        //setLoading(false);
      })
  }

  return (
    <div>
      <h1>Raffle</h1>
      <div>
        {raffleIsActive ? (
          <p>😛 Raffle is Active</p>
        ) : (
          <p>😡 Raffle is not active</p>
        )}
        {subscriptionIsActive ? (
          <p>😛 Subscription is Active</p>
        ) : (
          <p>😡 Subscription is not Active</p>
        )}
        <button onClick={() => subscribeToRaffle()}>subscribe To Raffle</button>
        <br />
        <button onClick={() => mintNftRaffle()}>mint</button>
      </div>

      {refundAvailable && (
        <div>
          <p>You can claim :</p>
          <button onClick={() => claimFund()}>Claim fund</button>
        </div>
      )}

      {transactionReceipt && confirmationMessage()}

      {error && (
        <h5>
          😥 Something went wrong:
          <br />
          {error}
        </h5>
      )}
    </div>
  )
}

export default Subscriber
