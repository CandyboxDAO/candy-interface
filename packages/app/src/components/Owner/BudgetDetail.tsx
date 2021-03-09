import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, DescriptionsProps, Input } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import { ContractName } from 'constants/contract-name'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { Budget } from 'models/budget'
import moment from 'moment'
import { useContext, useMemo, useState } from 'react'
import { addressExists } from 'utils/addressExists'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatBudgetCurrency } from 'utils/budgetCurrency'
import { CurrencyUtils, formatWad, parseWad } from 'utils/formatCurrency'

import TooltipLabel from '../shared/TooltipLabel'
import BudgetHeader from './BudgetHeader'

export default function BudgetDetail({ budget }: { budget: Budget }) {
  const {
    transactor,
    onNeedProvider,
    contracts,
    userAddress,
    usdPerEth,
  } = useContext(UserContext)

  const currencyUtils = new CurrencyUtils(usdPerEth)

  const [tapAmount, setTapAmount] = useState<string>()
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>()

  const currency = formatBudgetCurrency(budget.currency)

  const juicerFeePercent = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'fee',
    valueDidChange: bigNumbersDiff,
  })

  const tappableAmount = useContractReader<BigNumber>({
    contract: ContractName.BudgetStore,
    functionName: 'getTappableAmount',
    args: juicerFeePercent
      ? [budget.id.toHexString(), juicerFeePercent?.toHexString()]
      : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        budget.id
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [budget.id.toHexString()],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Tap',
                topics: [budget.id.toHexString()],
              },
            ]
          : undefined,
      [budget.id],
    ),
  })

  const formattedTappedTotal = useMemo(
    () =>
      currency === 'USD'
        ? currencyUtils.weiToUsd(budget.tappedTotal)?.toString()
        : formatWad(budget.tappedTotal),
    [budget.tappedTotal],
  )

  const formattedTappable = useMemo(
    () =>
      currency === 'USD'
        ? currencyUtils.weiToUsd(tappableAmount)?.toString()
        : formatWad(tappableAmount),
    [],
  )

  // TODO recalculate every second
  const secondsLeft =
    budget &&
    Math.floor(
      budget.start.toNumber() +
        budget.duration.toNumber() -
        new Date().valueOf() / 1000,
    )

  const isOwner = budget?.project === userAddress

  function detailedTimeString(millis: number) {
    if (!millis || millis <= 0) return 0

    const days = millis && millis / 1000 / SECONDS_IN_DAY
    const hours = days && (days % 1) * 24
    const minutes = hours && (hours % 1) * 60
    const seconds = minutes && (minutes % 1) * 60

    return `${days && days >= 1 ? Math.floor(days) + 'd ' : ''}${
      hours && hours >= 1 ? Math.floor(hours) + 'h ' : ''
    }
        ${minutes && minutes >= 1 ? Math.floor(minutes) + 'm ' : ''}
        ${seconds && seconds >= 1 ? Math.floor(seconds) + 's' : ''}`
  }

  function tap() {
    if (!transactor || !contracts?.Juicer) return onNeedProvider()

    setLoadingWithdraw(true)

    const id = budget.id.toHexString()

    if (!tapAmount) {
      setLoadingWithdraw(false)
      return
    }

    const amount = parseWad(tapAmount)

    if (!amount) return

    transactor(
      contracts.Juicer,
      'tap',
      [id, amount.toHexString(), userAddress],
      {
        onDone: () => setLoadingWithdraw(false),
      },
    )
  }

  const descriptionsStyle: DescriptionsProps = {
    labelStyle: { fontWeight: 600 },
    size: 'middle',
  }

  const gutter = 25

  const formatDate = (date: number) => moment(date).format('M-DD-YYYY h:mma')

  const isEnded: string | undefined = useMemo(
    () =>
      budget.start.add(budget.duration).toNumber() * 1000 < new Date().valueOf()
        ? formatDate(budget.start.add(budget.duration).toNumber() * 1000)
        : undefined,
    [budget.start, budget.duration],
  )

  const isUpcoming = useMemo(
    () => budget.start.gt(Math.round(new Date().valueOf() / 1000)),
    [budget.start],
  )

  if (!budget) return null

  return (
    <div>
      <BudgetHeader budget={budget} gutter={gutter} />

      <Descriptions {...descriptionsStyle} column={2} bordered>
        <Descriptions.Item label="Start">
          {formatDate(budget.start.toNumber() * 1000)}
        </Descriptions.Item>

        <Descriptions.Item label="Duration">
          {detailedTimeString(budget && budget.duration.toNumber() * 1000)}
        </Descriptions.Item>

        {isUpcoming ? null : (
          <Descriptions.Item label={isEnded ? 'Ended' : 'Time left'}>
            {(secondsLeft && detailedTimeString(secondsLeft * 1000)) || isEnded}
          </Descriptions.Item>
        )}

        {isUpcoming ? null : (
          <Descriptions.Item
            label={
              <TooltipLabel
                label="Tapped"
                tip="The amount that the project owner has tapped from this budget. The owner can tap up to the specified target."
              />
            }
          >
            {formattedTappedTotal?.toString()} {currency}
          </Descriptions.Item>
        )}

        {isUpcoming ? null : (
          <Descriptions.Item
            label={
              <TooltipLabel
                label="Tappable"
                tip="The amount that the project owner can still tap from this budget."
              />
            }
            span={2}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {formattedTappable} {currency}
              {isOwner && tappableAmount?.gt(0) ? (
                <div>
                  <Button
                    loading={loadingWithdraw}
                    onClick={() => setWithdrawModalVisible(true)}
                  >
                    Withdraw
                  </Button>
                  <Modal
                    title="Withdraw funds"
                    visible={withdrawModalVisible}
                    onOk={() => {
                      tap()
                      setWithdrawModalVisible(false)
                    }}
                    onCancel={() => {
                      setTapAmount(undefined)
                      setWithdrawModalVisible(false)
                    }}
                    okText="Withdraw"
                    width={540}
                  >
                    <Input
                      name="withdrawable"
                      placeholder="0"
                      suffix={currency}
                      value={tapAmount}
                      max={formattedTappable}
                      onChange={e => setTapAmount(e.target.value)}
                    />
                  </Modal>
                </div>
              ) : null}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>

      {budget?.link ? (
        <div
          style={{
            display: 'block',
            margin: gutter,
          }}
        >
          <a href={budget.link} target="_blank" rel="noopener noreferrer">
            {budget.link}
          </a>
        </div>
      ) : null}

      <div style={{ margin: gutter }}>
        <Descriptions {...descriptionsStyle} size="small" column={2}>
          <Descriptions.Item
            label={
              <TooltipLabel
                label="Discount Rate"
                tip="The rate at which payments to future
                budgeting time frames are valued compared to payments to the current one. For example, if this is set to 97%, then someone who pays 100 towards the next budgeting time frame will only receive 97% the amount of tickets received by someone who paid 100 towards this budgeting time frame."
              />
            }
          >
            {budget.discountRate.toString()} %
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <TooltipLabel
                label="Reserved for owner"
                tip="This project's owner can mint tickets for themselves to share in the overflow with all contributors. For example, if this is set to 5% and 95 tickets were given out over the course of this budget, then the owner will be able to mint 5 tickets for themselves once the budget expires."
              />
            }
          >
            {budget.p.toString()}%
          </Descriptions.Item>

          {!addressExists(budget.bAddress) ? null : (
            <Descriptions.Item
              label={
                <TooltipLabel
                  label="Reserved donation amount"
                  tip="A percentage of this budget's overflow can be reserved for the specified address. For example, if this is set to 5% and there is 1000 DAI of overflow, the donation address will be able to claim 50 DAI once this budget expires."
                />
              }
            >
              {budget.b.toString()}%
            </Descriptions.Item>
          )}

          {!addressExists(budget.bAddress) ? null : (
            <Descriptions.Item label="Beneficiary address" span={2}>
              {budget.bAddress}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </div>
  )
}
