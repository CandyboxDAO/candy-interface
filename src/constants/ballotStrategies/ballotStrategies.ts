import { constants } from 'ethers'
import { t } from '@lingui/macro'

import { readNetwork } from 'constants/networks'

export type Strategy = {
  address: string
  name: string
  description?: string
  unknown?: boolean
}

const strategys = {
   Delay7day: function(chainId:number){ return chainId === 56 ? "0xa0A2370Ad1D5AD31d30665E3B759be2Ba177211a": "0x6aADDfc7E2AC4123e22F4fe252a27cc94F4A84f2"},
   Delay3day: function(chainId:number){ return chainId === 56 ? "0x05ED5FE62FDb5216b1105Ed7DE80A79b01D8642F": "0x97F2a114C7a59745870e97E59f0Ca39791D9ad40"}
}

export function ballotStrategies() {
  return [
    {
      name: t`No strategy`,
      description: t`Any reconfiguration to an upcoming funding cycle will take effect once the current cycle ends. A project with no strategy may be vulnerable to being rug-pulled by its owner.`,
      address: constants.AddressZero,
    },
    {
      name: t`7-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.`,
      address: strategys.Delay7day(readNetwork.chainId) // '0xEf7480b6E7CEd228fFB0854fe49A428F562a8982',
    },
    {
      name: t`3-day delay`,
      description: t`A reconfiguration to an upcoming funding cycle must be submitted at least 3 days before it starts.`,
      address: strategys.Delay3day(readNetwork.chainId) //'0x6d6da471703647Fd8b84FFB1A29e037686dBd8b2',
    },
  ]
}

export const customStrategy = (address: string) => ({
  address,
  name: t`Custom strategy`,
  description: t`Unrecognized strategy contract. Make sure this is correct!`,
  unknown: true,
})
