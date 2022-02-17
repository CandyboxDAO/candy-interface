import { t, Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { TicketMod } from 'models/mods'
import { useCallback, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
// import { fromWad } from 'utils/formatNumber'
import stripPercent from 'utils/stripPercent'

export type TokenFormFields = {
  discountRate: string
  reservedRate: string
  redemptionRate: string
}

export default function TokenTabContent() {
  const [tokenForm] = useForm<TokenFormFields>()

  const {
    fundingCycleMetadata,
    fundingCycleData,
    reserveTokenSplits: reduxReserveTokenSplits,
  } = useAppSelector(state => state.editingV2Project)

  const reduxDiscountRate = fundingCycleData?.discountRate
  const reduxReservedRate = fundingCycleMetadata?.reservedRate
  const reduxRedemptionRate = fundingCycleMetadata?.redemptionRate
  console.log('reduxRedemptionRate:', reduxRedemptionRate)

  const [reserveTokenSplits, setReserveTokenSplits] = useState<TicketMod[]>(
    reduxReserveTokenSplits ?? [],
  )

  const [discountRateDisabled, setDiscountRateDisabled] = useState<boolean>(
    reduxDiscountRate === undefined || reduxDiscountRate === '0', // used == to include both string or number
  )

  const [reservedRateDisabled, setReservedRateDisabled] = useState<boolean>(
    reduxReservedRate === undefined || reduxReservedRate === '0',
  )

  const [bondingCurveDisabled, setBondingCurveDisabled] = useState<boolean>(
    reduxRedemptionRate === undefined || reduxRedemptionRate === '0',
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
      discountRate: stripPercent(reduxDiscountRate) ?? 0,
      reservedRate: stripPercent(reduxReservedRate) ?? 0,
      redemptionRate: stripPercent(reduxRedemptionRate) ?? 100,
    })
    setReserveTokenSplits(reserveTokenSplits)
  }, [
    reduxDiscountRate,
    reduxReservedRate,
    reduxRedemptionRate,
    reserveTokenSplits,
    tokenForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetTokenForm()
  }, [resetTokenForm])

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
          <FormItems.ProjectDiscountRate
            value={tokenForm.getFieldValue('discountRate') ?? reduxDiscountRate} // use redux if form hasn't loaded yet
            name="discountRate"
            onChange={val => {
              tokenForm.setFieldsValue({ discountRate: val?.toString() })
            }}
            disabled={discountRateDisabled}
            toggleDisabled={(checked: boolean) => {
              if (!checked) {
                tokenForm.setFieldsValue({ discountRate: '0' })
              } else {
                tokenForm.setFieldsValue({ discountRate: '10' })
              }
              setDiscountRateDisabled(!checked)
            }}
          />
          <FormItems.ProjectReserved
            value={tokenForm.getFieldValue('reservedRate') ?? reduxReservedRate}
            name="reservedRate"
            onChange={val => {
              setReservedRate(val)
              tokenForm.setFieldsValue({ reservedRate: val?.toString() })
            }}
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
              formItemProps={{
                label: t`Reserved token allocation (optional)`,
                extra: t`Allocate a portion of your project's reserved tokens to other Ethereum wallets or Juicebox projects.`,
              }}
              reservedRate={reservedRate ?? 0}
            />
          ) : null}
          <FormItems.ProjectBondingCurveRate
            name="bondingCurveRate"
            value={
              tokenForm.getFieldValue('redemptionRate') ?? reduxRedemptionRate
            }
            onChange={(val?: number) =>
              tokenForm.setFieldsValue({ redemptionRate: val?.toString() })
            }
            disabled={bondingCurveDisabled}
            toggleDisabled={(checked: boolean) => {
              if (checked) {
                tokenForm.setFieldsValue({ redemptionRate: '0' })
              } else {
                tokenForm.setFieldsValue({ redemptionRate: '100' })
              }
              setBondingCurveDisabled(!checked)
            }}
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
