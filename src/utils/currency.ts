import { CurrencyOption } from 'models/currency-option'
import { CSSProperties } from 'react'

import BnbLogo from 'components/icons/Bnb'

import { CURRENCY_ETH, CURRENCY_USD } from 'constants/currency'

const currencies: Record<
  CurrencyOption,
  { name: 'BNB' | 'USD'; symbol: 'BNB' | 'US$'; style?: CSSProperties }
> = {
  [CURRENCY_ETH]: {
    name: 'BNB',
    symbol: 'BNB',
    style: {
      fontFamily: 'sans-serif',
      verticalAlign: 'middle'
    },    
  },
  [CURRENCY_USD]: {
    name: 'USD',
    symbol: 'US$',
  },
}

export const currencyName = (
  currency?: CurrencyOption,
): typeof currencies[keyof typeof currencies]['name'] | undefined =>
  currency !== undefined ? currencies[currency].name : undefined

export const currencySymbol = (currency?: CurrencyOption) =>
  currency !== undefined ? 
    ((currencies[currency].symbol === currencies[0].symbol)? BnbLogo({size:24}): currencies[currency].symbol):undefined
  //  currencies[currency].symbol : undefined

export const currencyStyle = (currency?: CurrencyOption) =>
  currency !== undefined ? currencies[currency].style : undefined
