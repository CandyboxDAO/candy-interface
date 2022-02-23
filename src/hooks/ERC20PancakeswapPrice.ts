import { Fetcher, Token, ChainId, WETH as WBNB, Route, Pair } from '@pancakeswap/sdk'

import { useQuery } from 'react-query'

import { readNetwork } from 'constants/networks'

import { WAD_DECIMALS } from 'constants/numbers'

/**
 * Fetches information about a pair and constructs a pair from the given two tokens.
 * @param tokenA first token
 * @param tokenB second token
 * @param provider the provider to use to fetch the data
 * Source: https://github.com/Uniswap/v2-sdk/blob/a88048e9c4198a5bdaea00883ca00c8c8e582605/src/fetcher.ts
 */
async function fetchPairData(tokenA: Token, tokenB: Token): Promise<Pair> {

  const pair = Fetcher.fetchPairData(tokenA, tokenB);

  return pair;
}

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
    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await fetchPairData(PROJECT_TOKEN, WETH)

    const route = new Route([pair], WETH, PROJECT_TOKEN)
    return {
      tokenSymbol,
      midPrice: route.midPrice,
    }
  })
}
