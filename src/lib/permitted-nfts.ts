
  import { TypedMap } from "@graphprotocol/graph-ts";
  let permittedContracts = new TypedMap<string, TypedMap<string, string>>()

  let val0 = new TypedMap<string, string>()
  val0.set('address', '0xfdf703b22a13f825d348af43d2bfc140054d0e3d')
  val0.set('contractName', "ChainFaces")
  val0.set('description', "")
  val0.set('imgSrc', "https://storage.opensea.io/files/747cfdaff938c2e982602f8b276f4be0.svg")
  val0.set('externalLink', "")
  val0.set('baseTokenURI', "")
  val0.set('baseImageURI', "")
  permittedContracts.set('0xfdf703b22a13f825d348af43d2bfc140054d0e3d' ,val0)

  export const permitted = permittedContracts
