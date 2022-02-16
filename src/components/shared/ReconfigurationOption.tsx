import { CheckCircleFilled } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { Strategy } from 'constants/ballotStrategies/ballotStrategies'

// This component is either the selected option which opens the drawer of all options, or is an option within that drawer.
export default function ReconfigurationOption({
  title,
  content,
  index,
  strategy,
  selected,
  onSelectBallot,
  onClick,
}: {
  title: string
  content: JSX.Element
  index: number
  strategy: Strategy
  selected: boolean
  onSelectBallot?: Function
  onClick?: Function
}) {
  const { colors, radii } = useContext(ThemeContext).theme
  return (
    <div
      key={index}
      className="clickable-border"
      style={{
        display: 'flex',
        padding: 10,
        borderRadius: radii.md,
        cursor: 'pointer',
        ...(selected
          ? { border: '1px solid ' + colors.stroke.action.primary }
          : {}),
      }}
      onClick={() => {
        if (onSelectBallot) {
          onSelectBallot(strategy)
        } else if (onClick) {
          onClick()
        }
      }}
    >
      <div
        style={{
          marginRight: 10,
          minWidth: 20,
          color: colors.text.action.primary,
        }}
      >
        {selected ? <CheckCircleFilled /> : null}
      </div>
      <div>
        <h3
          style={{
            color: selected ? colors.text.action.primary : colors.text.primary,
          }}
        >
          {title}
        </h3>
        {content}
      </div>
    </div>
  )
}
