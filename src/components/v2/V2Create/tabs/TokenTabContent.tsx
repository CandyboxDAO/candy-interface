import { t, Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { TicketMod } from 'models/mods'
import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import stripPercent from 'utils/stripPercent'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'

import { shadowCard } from 'constants/styles/shadowCard'

export type TokenFormFields = {
  discountRate: string
  reservedRate: string
  redemptionRate: string
}

export default function TokenTabContent() {
  const [tokenForm] = useForm<TokenFormFields>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { theme } = useContext(ThemeContext)

  const {
    fundingCycleMetadata,
    fundingCycleData,
    fundAccessConstraints,
    reserveTokenSplits: reduxReserveTokenSplits,
  } = useAppSelector(state => state.editingV2Project)

  const reduxDiscountRate = fundingCycleData?.discountRate
  const reduxReservedRate = fundingCycleMetadata?.reservedRate
  const reduxRedemptionRate = fundingCycleMetadata?.redemptionRate

  const [reserveTokenSplits, setReserveTokenSplits] = useState<TicketMod[]>(
    reduxReserveTokenSplits ?? [],
  )

  const [discountRateDisabled, setDiscountRateDisabled] = useState<boolean>(
    reduxDiscountRate === undefined || reduxDiscountRate === '0',
  )

  const [reservedRateDisabled, setReservedRateDisabled] = useState<boolean>(
    reduxReservedRate === undefined || reduxReservedRate === '0',
  )

  const [redemptionRateDisabled, setRedemptionRateDisabled] = useState<boolean>(
    reduxRedemptionRate === undefined || reduxRedemptionRate === '100',
  )

  // Using a state here because relying on the form does not
  // pass through updated reservedRate to ProjectTicketMods
  const [reservedRate, setReservedRate] = useState<number | undefined>(
    parseFloat(reduxReservedRate),
  )

  const dispatch = useAppDispatch()

  const onTokenFormSaved = useCallback(() => {
    const fields = tokenForm.getFieldsValue(true)
    dispatch(editingV2ProjectActions.setDiscountRate(fields.discountRate))
    dispatch(editingV2ProjectActions.setReservedRate(fields.reservedRate))
    dispatch(editingV2ProjectActions.setRedemptionRate(fields.redemptionRate))
    dispatch(editingV2ProjectActions.setReserveTokenSplits(reserveTokenSplits))
  }, [dispatch, tokenForm, reserveTokenSplits])

  const resetTokenForm = useCallback(() => {
    tokenForm.setFieldsValue({
      discountRate: stripPercent(reduxDiscountRate) ?? '0',
      reservedRate: stripPercent(reduxReservedRate) ?? '0',
      redemptionRate: stripPercent(reduxRedemptionRate) ?? '100',
    })
    setReserveTokenSplits(reserveTokenSplits)
  }, [
    reduxDiscountRate,
    reduxReservedRate,
    reduxRedemptionRate,
    reserveTokenSplits,
    tokenForm,
  ])

  const disableTextStyle: CSSProperties = {
    color: colors.text.primary,
    fontStyle: 'italic',
    fontWeight: 500,
    marginBottom: 10,
  }

  // initially fill form with any existing redux state
  useEffect(() => {
    resetTokenForm()
  }, [resetTokenForm])

  // Assume the first item is the one of interest.
  const fundAccessConstraint = fundAccessConstraints[0] as
    | SerializedV2FundAccessConstraint
    | undefined

  const _hasFundingTarget = Boolean(
    parseFloat(fundAccessConstraint?.distributionLimit ?? '0'),
  )
  const _hasFundingDuration = Boolean(
    parseFloat(fundingCycleData?.duration ?? '0'),
  )

  return (
    <div>
      <Space direction="vertical" size="large">
        <p>
          <Trans>
            <strong>Note: </strong>Updates you make to token attributes will{' '}
            <i>not be applied immediately</i> and only take effect in{' '}
            <i>upcoming funding cycles.</i>
          </Trans>
        </p>
        <Form form={tokenForm} layout="vertical">
          <FormItems.ProjectReserved
            value={tokenForm.getFieldValue('reservedRate') ?? reduxReservedRate}
            name="reservedRate"
            onChange={val => {
              setReservedRate(val)
              tokenForm.setFieldsValue({ reservedRate: val?.toString() })
            }}
            style={{ ...shadowCard(theme), padding: 25 }}
            disabled={reservedRateDisabled}
            toggleDisabled={(checked: boolean) => {
              if (!checked) {
                tokenForm.setFieldsValue({ reservedRate: '0' })
              } else {
                tokenForm.setFieldsValue({ reservedRate: '20' })
              }
              setReservedRateDisabled(!checked)
            }}
          />
          {!reservedRateDisabled ? (
            <FormItems.ProjectTicketMods
              name="reserveTokenSplits"
              mods={reserveTokenSplits}
              onModsChanged={(splits: TicketMod[]) => {
                setReserveTokenSplits(splits)
              }}
              style={{ ...shadowCard(theme), padding: 25 }}
              formItemProps={{
                label: t`Reserved token allocation (optional)`,
                extra: t`Allocate a portion of your project's reserved tokens to other Ethereum wallets or Juicebox projects.`,
              }}
              reservedRate={reservedRate ?? 0}
            />
          ) : null}
          <br />
          {!_hasFundingDuration && (
            <div style={{ ...disableTextStyle }}>
              <Trans>
                Discount rate disabled when funding cycle duration has not been
                set.
              </Trans>
            </div>
          )}
          <FormItems.ProjectDiscountRate
            value={tokenForm.getFieldValue('discountRate') ?? reduxDiscountRate} // use redux if form hasn't loaded yet
            name="discountRate"
            onChange={val => {
              tokenForm.setFieldsValue({ discountRate: val?.toString() })
            }}
            style={{ ...shadowCard(theme), padding: 25 }}
            disabled={discountRateDisabled}
            toggleDisabled={
              _hasFundingDuration
                ? (checked: boolean) => {
                    if (!checked) {
                      tokenForm.setFieldsValue({ discountRate: '0' })
                    } else {
                      tokenForm.setFieldsValue({ discountRate: '10' })
                    }
                    setDiscountRateDisabled(!checked)
                  }
                : undefined
            }
          />
          <br />
          {!_hasFundingTarget && (
            <div style={{ ...disableTextStyle }}>
              <Trans>Redemption disabled while no funding target is set.</Trans>
            </div>
          )}
          <FormItems.ProjectBondingCurveRate
            name="redemptionRate"
            value={
              tokenForm.getFieldValue('redemptionRate') ?? reduxRedemptionRate
            }
            onChange={(val?: number) =>
              tokenForm.setFieldsValue({ redemptionRate: val?.toString() })
            }
            style={{ ...shadowCard(theme), padding: 25 }}
            label={t`Redemption rate`}
            disabled={redemptionRateDisabled}
            toggleDisabled={
              _hasFundingTarget
                ? (checked: boolean) => {
                    if (checked) {
                      tokenForm.setFieldsValue({ redemptionRate: '0' })
                    } else {
                      tokenForm.setFieldsValue({ redemptionRate: '100' })
                    }
                    setRedemptionRateDisabled(!checked)
                  }
                : undefined
            }
          />
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              onClick={async () => {
                await tokenForm.validateFields()
                onTokenFormSaved()
              }}
            >
              <Trans>Save token configuration</Trans>
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  )
}
