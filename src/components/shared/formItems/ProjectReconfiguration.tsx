import { t } from '@lingui/macro'
import { Form } from 'antd'
import { useState } from 'react'

import { ballotStrategies } from 'constants/ballotStrategies/ballotStrategies'
import { getBallotStrategyByAddress } from 'constants/ballotStrategies/getBallotStrategiesByAddress'

import ReconfigurationDrawer from '../ReconfigurationDrawer'
import ReconfigurationOption from '../ReconfigurationOption'

export default function ProjectReconfiguration({
  value,
  onChange,
}: {
  value: string
  onChange: (address: string) => void
}) {
  // const {
  //   theme: { colors },
  // } = useContext(ThemeContext)

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  // console.log('value: ', value)
  const selectedStrategy = value
    ? getBallotStrategyByAddress(value)
    : ballotStrategies()[2]

  return (
    <Form.Item
      extra={t`Rules for how this project's funding cycles can be reconfigured.`}
      name={'reconfiguration'}
      label={t`Reconfiguration`}
      // {...formItemProps}
    >
      <ReconfigurationOption
        title={selectedStrategy.name}
        index={0}
        content={<p>{selectedStrategy.description}</p>}
        selected={true}
        strategy={selectedStrategy}
        onClick={() => setDrawerVisible(true)}
      />
      <ReconfigurationDrawer
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        initialSelectedStrategy={selectedStrategy}
        onSave={onChange}
      />
    </Form.Item>
  )
}
