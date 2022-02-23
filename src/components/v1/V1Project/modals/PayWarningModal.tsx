import { Modal } from 'antd'
import { t, Trans } from '@lingui/macro'

export default function PayWarningModal({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
}) {
  return (
    <Modal
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={t`I understand`}
      cancelButtonProps={{ hidden: true }}
      width={400}
    >
      <h2>
        <Trans>Heads up</Trans>
      </h2>
      <p style={{ fontWeight: 500 }}>
        <a
          href="https://github.com/candyboxdao/candy-contracts"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Candybox contracts</Trans>
        </a>{' '}
        <Trans>
          are unaudited, and may be vulnerable to bugs or hacks. All funds moved
          through Candybox could be lost or stolen. CandyboxDAO and Peel are not
          liable for any losses by projects or their supporters.
        </Trans>
      </p>
    </Modal>
  )
}
