import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { ZERO_ADDRESS } from './constants'

export let ZERO = BigInt.fromI32(0)
export let ONE = BigInt.fromI32(1)
export let WEI_PER_ETHER = BigInt.fromString('1000000000000000000')

export function toDecimal(value: BigInt, decimals: u32 = 18): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<u8>decimals)
    .toBigDecimal()

  return value.divDecimal(precision)
}

export namespace address {
  // Helpers
  export function isZeroAddress(address: Address): boolean {
    return address.toHexString() == ZERO_ADDRESS
  }
}
