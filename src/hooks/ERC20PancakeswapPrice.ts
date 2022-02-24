import { Fetcher, ChainId, WETH as WBNB, Route,Token } from '@pancakeswap/sdk'

import { useQuery } from 'react-query'

import { readNetwork } from 'constants/networks'

import { readProvider } from 'constants/readProvider'

import { WAD_DECIMALS } from 'constants/numbers'

type Props = {
  tokenSymbol: string
  tokenAddress: string
}

const networkId = readNetwork.chainId

export function usePancakeswapPriceQuery({ tokenSymbol, tokenAddress }: Props) {

  const PROJECT_TOKEN = new Token(
    networkId,
    tokenAddress,
    WAD_DECIMALS,
    tokenSymbol,
  )
  const WETH = readNetwork.chainId === ChainId.MAINNET? WBNB[ChainId.MAINNET]:WBNB[ChainId.TESTNET]

  return useQuery([`${tokenSymbol}-pancakeswap-price`], async () => {
    
    // const projectToken = await Fetcher.fetchTokenData(networkId, "0x87230146e138d3f296a9a77e497a2a83012e9bc5",readProvider);

    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair =  await Fetcher.fetchPairData(PROJECT_TOKEN, WETH, readProvider);

    const route = new Route([pair], WETH, PROJECT_TOKEN)
    return {
      tokenSymbol,
      midPrice: route.midPrice,
    }
  })
}
