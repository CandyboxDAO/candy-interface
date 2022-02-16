import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import OthersForm, {
  OthersFormFields,
} from 'components/shared/forms/OthersForm'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useEffect } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { ballotStrategies } from 'constants/ballotStrategies/ballotStrategies'

export default function OthersTabContent() {
  const [othersForm] = useForm<OthersFormFields>()
  const dispatch = useAppDispatch()
  const { fundingCycle: editingV2FundingCycle } = useAppSelector(
    state => state.editingV2Project,
  )

  const onOthersFormSaved = useCallback(() => {
    const fields = othersForm.getFieldsValue(true)
    dispatch(editingV2ProjectActions.setPayIsPaused(fields.payIsPaused))
    dispatch(
      editingV2ProjectActions.setTicketPrintingIsAllowed(
        fields.ticketPrintingIsAllowed,
      ),
    )
    dispatch(editingV2ProjectActions.setBallot(fields.ballot))
  }, [dispatch, othersForm])

  const resetOthersForm = useCallback(() => {
    othersForm.setFieldsValue({
      payIsPaused: editingV2FundingCycle?.payIsPaused ?? false,
      ticketPrintingIsAllowed:
        editingV2FundingCycle?.ticketPrintingIsAllowed ?? false,
      ballot: editingV2FundingCycle?.ballot ?? ballotStrategies()[2].address, // 3-day delay default
    })
  }, [
    editingV2FundingCycle?.payIsPaused,
    editingV2FundingCycle?.ticketPrintingIsAllowed,
    editingV2FundingCycle?.ballot,
    othersForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetOthersForm()
  }, [resetOthersForm])

  return (
    <div>
      <Space direction="vertical" size="large">
        <p>
          <Trans>
            <strong>Note: </strong>Updates you make to attributes in this
            section will <i>not be applied immediately</i> and only take effect
            in <i>upcoming funding cycles.</i>
          </Trans>
        </p>
        <OthersForm form={othersForm} onSave={onOthersFormSaved} />
      </Space>
    </div>
  )
}
