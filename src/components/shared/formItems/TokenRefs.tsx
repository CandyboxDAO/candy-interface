import { CaretDownFilled, CloseCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Form, Input } from 'antd'
import { constants } from 'ethers'
import { TokenRef } from 'models/token-ref'

import ProjectHandleFormItem from './ProjectHandle/ProjectHandleFormItem'

export default function TokenRefs({
  refs,
  onRefsChange,
}: {
  refs: TokenRef[]
  onRefsChange: (x: TokenRef[]) => void
}) {
  return (
    <div>
      {refs.map((r, i) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', height: 40 }}>
            <Button
              style={{ marginRight: 20, width: 100 }}
              type="text"
              icon={<CaretDownFilled />}
              onClick={() =>
                onRefsChange(
                  refs.map((_r, _i) =>
                    i === _i
                      ? {
                          type: _r.type === 'bep20' ? 'project' : 'bep20',
                          value: '',
                        }
                      : _r,
                  ),
                )
              }
            >
              {r.type === 'bep20' ? 'BEP-20' : 'Project'}
            </Button>

            <div style={{ flex: 1 }}>
              {r.type === 'bep20' ? (
                <Form.Item>
                  <Input
                    value={r.value}
                    placeholder={constants.AddressZero}
                    onChange={e =>
                      onRefsChange(
                        refs.map((_r, _i) =>
                          i === _i ? { ..._r, value: e.target.value } : _r,
                        ),
                      )
                    }
                  />
                </Form.Item>
              ) : (
                <ProjectHandleFormItem
                  formItemProps={{
                    label: null,
                    initialValue: r.value ? BigNumber.from(r.value) : '',
                  }}
                  requireState="exists"
                  returnValue="id"
                  onValueChange={value =>
                    onRefsChange(
                      refs.map((_r, _i) => (i === _i ? { ..._r, value } : _r)),
                    )
                  }
                />
              )}
            </div>

            {refs.length > 1 && (
              <CloseCircleOutlined
                style={{ marginLeft: 10, flexShrink: 1 }}
                onClick={() => onRefsChange(refs.filter((_r, _i) => _i !== i))}
              />
            )}
          </div>
        </div>
      ))}

      <Button
        style={{ marginTop: 10 }}
        size="small"
        block
        onClick={() => onRefsChange([...refs, { type: 'bep20', value: '' }])}
      >
        Add
      </Button>
    </div>
  )
}
