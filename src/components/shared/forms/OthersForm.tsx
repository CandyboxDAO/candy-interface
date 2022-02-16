import { Button, Form, FormInstance, Switch } from 'antd'
import { t, Trans } from '@lingui/macro'

import { useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import { FormItems } from '../formItems'
import { ballotStrategies } from 'constants/ballotStrategies/ballotStrategies'

export type OthersFormFields = {
  payIsPaused: boolean
  ticketPrintingIsAllowed: boolean
  ballot: string
}

export default function OthersForm({
  form,
  onSave,
}: {
  form: FormInstance<OthersFormFields>
  onSave: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [showTicketPrintingWarning, setShowTicketPrintingWarning] =
    useState<boolean>(false)

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="payIsPaused"
        label={t`Pause payments`}
        extra={t`Your project cannot receive direct payments while paused.`}
        valuePropName={'checked'}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        name="ticketPrintingIsAllowed"
        label={t`Allow minting tokens`}
        extra={t`Enabling this allows the project owner to manually mint any amount of tokens to any address.`}
        valuePropName="checked"
      >
        <Switch
          onChange={val => {
            setShowTicketPrintingWarning(val)
          }}
        />
      </Form.Item>
      {showTicketPrintingWarning && (
        <Form.Item>
          <p style={{ color: colors.text.warn }}>
            <Trans>
              Enabling tokens to be minted will appear risky to contributors,
              and should only be used when necessary.
            </Trans>
          </p>
        </Form.Item>
      )}
      <FormItems.ProjectReconfiguration
        value={form.getFieldValue('ballot') ?? ballotStrategies()[2].address}
        onChange={(address: string) => form.setFieldsValue({ ballot: address })}
      />
      <Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          onClick={async () => {
            await form.validateFields()
            onSave()
          }}
        >
          <Trans>Save project details</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
