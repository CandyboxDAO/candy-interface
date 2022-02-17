import { t } from '@lingui/macro'
import { Form } from 'antd'
import { useState } from 'react'

import {
  ballotStrategies,
  Strategy,
} from 'constants/ballotStrategies/ballotStrategies'
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
  const threeDayDelayStrategy = ballotStrategies()[2]

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(
    getBallotStrategyByAddress(value),
  )

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
        onSave={(strategy: Strategy) => {
          setSelectedStrategy(strategy)
          onChange(strategy.address ?? threeDayDelayStrategy.address) //default to 3-day
        }}
      />
    </Form.Item>
  )
}
