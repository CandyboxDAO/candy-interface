import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Space, Statistic, Tag } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import { ContractName } from 'constants/contract-name'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import {
  formattedNum,
  formatWad,
  fromWad,
  parseWad,
} from 'utils/formatCurrency'

import TooltipLabel from '../shared/TooltipLabel'

export default function Rewards({
  projectId,
}: {
  projectId: BigNumber | undefined
}) {
  const {
    weth,
    contracts,
    transactor,
    userAddress,
    onNeedProvider,
  } = useContext(UserContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [minRedeemAmount, setMinRedeemAmount] = useState<BigNumber>()

  const converter = useCurrencyConverter()

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.Juicer,
        eventName: 'Pay',
        topics: projectId ? [[], projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.Juicer,
        eventName: 'Redeem',
        topics: projectId ? [[], projectId?.toHexString()] : undefined,
      },
    ],
    [projectId],
  )

  const bondingCurveRate = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'bondingCurveRate',
    valueDidChange: bigNumbersDiff,
  })
  const ticketsBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketStore,
    functionName: 'balanceOf',
    args:
      userAddress && projectId ? [userAddress, projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const ticketSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketStore,
    functionName: 'totalSupply',
    args: [projectId?.toHexString()],
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  // TODO Juicer.claimableAmount
  const onChangeRedeemAmount = useCallback(
    (amount: string | undefined) => {
      setRedeemAmount(amount)

      if (
        amount === undefined ||
        !totalOverflow ||
        !bondingCurveRate ||
        !ticketSupply ||
        ticketSupply.eq(0)
      ) {
        setMinRedeemAmount(undefined)
      } else {
        setMinRedeemAmount(
          parseWad(amount)
            ?.mul(totalOverflow)
            .mul(bondingCurveRate)
            .div(1000)
            .div(ticketSupply),
        )
      }
    },
    [
      setRedeemAmount,
      setMinRedeemAmount,
      bondingCurveRate,
      ticketSupply,
      totalOverflow,
    ],
  )

  useEffect(() => onChangeRedeemAmount(fromWad(ticketsBalance)), [
    ticketsBalance,
    totalOverflow,
    ticketSupply,
    bondingCurveRate,
    onChangeRedeemAmount,
  ])

  const share = ticketSupply?.gt(0)
    ? ticketsBalance
        ?.mul(100)
        .div(ticketSupply)
        .toString()
    : '0'

  function redeem() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!minRedeemAmount) return

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad || !projectId) return

    transactor(
      contracts.Juicer,
      'redeem',
      [
        projectId.toHexString(),
        redeemWad.toHexString(),
        minRedeemAmount.toHexString(),
        userAddress,
      ],
      {
        onConfirmed: () => onChangeRedeemAmount(undefined),
      },
    )
  }

  const subText = (text: string) => (
    <div
      style={{
        fontSize: '.8rem',
        fontWeight: 500,
      }}
    >
      {text}
    </div>
  )

  const redeemDisabled = !totalOverflow || totalOverflow.eq(0)

  return (
    <Space direction="vertical" size="large" align="start">
      <Statistic
        title={
          <TooltipLabel
            label="Project overflow"
            tip="Surplus funds for this project that can be claimed by ticket holders."
            placement="bottom"
          />
        }
        valueRender={() => (
          <div>
            {formatWad(totalOverflow ?? 0)} {weth?.symbol}
            <div style={{ fontSize: '.8rem' }}>
              {formattedNum(converter.weiToUsd(totalOverflow))} USD
            </div>
          </div>
        )}
      />

      <Statistic
        title={
          <TooltipLabel
            label="Your wallet"
            tip="Tickets can be redeemed for your contract's overflow on a bonding
            curve – a ticket is redeemable for 38.2% of its proportional
            overflowed tokens. Meaning, if there are 100 overflow tokens available
            and 100 of your tickets in circulation, 10 tickets could be redeemed
            for 3.82 of the overflow tokens. The rest is left to share between the
            remaining ticket hodlers."
            placement="bottom"
          />
        }
        valueRender={() => (
          <div>
            <div>{formatWad(ticketsBalance ?? 0)} tickets</div>
            {subText(
              `${share ?? 0}% of ${formatWad(ticketSupply) ??
                0} tickets in circulation`,
            )}
            <Space style={{ marginTop: 10 }}>
              <Input
                type="number"
                disabled={redeemDisabled}
                placeholder="0"
                value={redeemAmount}
                suffix={
                  redeemDisabled ? null : (
                    <InputAccessoryButton
                      content="MAX"
                      onClick={() =>
                        onChangeRedeemAmount(fromWad(ticketsBalance))
                      }
                    />
                  )
                }
                max={fromWad(ticketsBalance)}
                onChange={e => onChangeRedeemAmount(e.target.value)}
              />
              <Button
                type="primary"
                onClick={() => setRedeemModalVisible(true)}
                disabled={redeemDisabled}
              >
                Redeem tickets
              </Button>

              <Modal
                title="Redeem tickets"
                visible={redeemModalVisible}
                onOk={() => {
                  redeem()
                  setRedeemModalVisible(false)
                }}
                onCancel={() => {
                  onChangeRedeemAmount(undefined)
                  setRedeemModalVisible(false)
                }}
                okText="Confirm"
                width={540}
              >
                <Space direction="vertical">
                  <div>Redeem {redeemAmount} tickets</div>
                  <div>
                    You will receive minimum {formatWad(minRedeemAmount)}{' '}
                    {weth?.symbol}
                  </div>
                </Space>
              </Modal>
            </Space>
          </div>
        )}
      ></Statistic>
    </Space>
  )
}
