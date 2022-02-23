// import { useUniswapPriceQuery } from 'hooks/ERC20UniswapPrice'
import { useSushiswapPriceQuery } from 'hooks/ERC20SushiswapPrice'
import { usePancakeswapPriceQuery } from 'hooks/ERC20PancakeswapPrice'
import { CSSProperties } from 'react'

import TokenAMMPriceRow from './TokenAMMPriceRow'

type Props = {
  tokenSymbol: string
  tokenAddress: string
  style?: CSSProperties
}

/**
 * Component for rendering a set of AMM Prices.
 */
export default function AMMPrices({
  tokenSymbol,
  tokenAddress,
  style = {},
}: Props) {
  const { data: pancakeswapPriceData, isLoading: pancakeswapLoading } =
  usePancakeswapPriceQuery({
    tokenSymbol,
    tokenAddress,
  })

  // const { data: uniswapPriceData, isLoading: uniswapLoading } =
  //   useUniswapPriceQuery({
  //     tokenSymbol,
  //     tokenAddress,
  //   })

  const { data: sushiswapPriceData, isLoading: sushiswapLoading } =
    useSushiswapPriceQuery({
      tokenSymbol,
      tokenAddress,
    })

  return (
    <div style={{ ...style }}>
      <TokenAMMPriceRow
        exchangeName="Pancakeswap"
        tokenSymbol={tokenSymbol}
        exchangeLink={`https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=${tokenAddress}`}
        WETHPrice={pancakeswapPriceData?.midPrice.toFixed(0)}
        loading={pancakeswapLoading}
        style={{ marginBottom: '0.5rem' }}
      />
      <TokenAMMPriceRow
        exchangeName="Sushiswap"
        tokenSymbol={tokenSymbol}
        exchangeLink={`https://app.sushi.com/swap?inputCurrency=BNB&outputCurrency=${tokenAddress}`}
        WETHPrice={sushiswapPriceData?.midPrice.toFixed(0)}
        loading={sushiswapLoading}
      />
    </div>
  )
}
