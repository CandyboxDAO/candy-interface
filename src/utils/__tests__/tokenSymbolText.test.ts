import { tokenSymbolText } from '../tokenSymbolText'

describe('tokenSymbolText', () => {
  it.each`
    tokenSymbol  | capitalize | plural   | includeTokenWord | result
    ${'CBX'}     | ${true}    | ${true}  | ${true}          | ${'CBX Tokens'}
    ${'CBX'}     | ${true}    | ${true}  | ${false}         | ${'CBX'}
    ${'CBX'}     | ${true}    | ${false} | ${true}          | ${'CBX Token'}
    ${'CBX'}     | ${true}    | ${false} | ${false}         | ${'CBX'}
    ${'CBX'}     | ${false}   | ${true}  | ${true}          | ${'CBX tokens'}
    ${'CBX'}     | ${false}   | ${true}  | ${false}         | ${'CBX'}
    ${'CBX'}     | ${false}   | ${false} | ${true}          | ${'CBX token'}
    ${'CBX'}     | ${false}   | ${false} | ${false}         | ${'CBX'}
    ${undefined} | ${true}    | ${true}  | ${true}          | ${'Tokens'}
    ${undefined} | ${true}    | ${true}  | ${false}         | ${'Tokens'}
    ${undefined} | ${true}    | ${false} | ${true}          | ${'Token'}
    ${undefined} | ${true}    | ${false} | ${false}         | ${'Token'}
    ${undefined} | ${false}   | ${true}  | ${true}          | ${'tokens'}
    ${undefined} | ${false}   | ${true}  | ${false}         | ${'tokens'}
    ${undefined} | ${false}   | ${false} | ${true}          | ${'token'}
    ${undefined} | ${false}   | ${false} | ${false}         | ${'token'}
  `(
    'returns $result when tokenSymbol=$tokenSymbol, capitalize=$capitalize, plural=$plural, $includeTokenWord=includeTokenWord',
    ({ tokenSymbol, capitalize, plural, includeTokenWord, result }) => {
      expect(
        tokenSymbolText({ tokenSymbol, capitalize, plural, includeTokenWord }),
      ).toBe(result)
    },
  )
})
