import { Address, log } from '@graphprotocol/graph-ts'
import {
  Transfer,
  ERC721
} from '../generated/ERC721/ERC721'

import { Asset, Collection, Account } from '../generated/schema'
import { permitted } from './lib/permitted-nfts'
import { address } from './lib'

export function handleTransfer(event: Transfer): void {
  let from = event.params.from
  let to = event.params.to

  getOrCreateCollection(event)
  let nft = getOrCreateAsset(event)

  getOrCreateAccount(from)
  getOrCreateAccount(to)

  // burn
  if (address.isZeroAddress(to)) {
    nft.burned = true
  }

  nft.owner = to.toHex()

  nft.save()
}

function getOrCreateCollection(event: Transfer): Collection {
  let collectionId = event.address.toHex()

  let collection = Collection.load(collectionId)
  if (collection == null) {
    collection = new Collection(collectionId)
    collection.symbol = "--"
    collection.name = "--"

    let collectionContract = ERC721.bind(event.address)
    let callResult = collectionContract.try_symbol();
    if (!callResult.reverted) {
      collection.symbol = callResult.value
    }

    callResult = collectionContract.try_name();
    if (!callResult.reverted) {
      collection.name = callResult.value
    }

    callResult = collectionContract.try_baseURI();
    if (!callResult.reverted) {
      collection.baseURI = callResult.value
    }

    let config = permitted.get(event.address.toHex())
    if (config) {
      let imgSrc = (config.get('imgSrc')) as string
      let description = config.get('description')
      let externalLink = config.get('externalLink')
      collection.imageURI = imgSrc != '' ? imgSrc : '--'
      collection.description = description != '' ? description : '--'
      collection.externalLink = externalLink != '' ? externalLink : '--'
    }

    collection.save()
  }

  return collection as Collection
}

function getOrCreateAsset(event: Transfer): Asset {
  let assetId = event.address.toHex() + '-' + event.params.tokenId.toString()

  let asset = Asset.load(assetId)
  if (asset == null) {
    asset = new Asset(assetId)
    asset.collection = event.address.toHex()
    asset.owner = event.params.to.toHex()
    asset.burned = false

    let config = permitted.get(event.address.toHex())
    let collectionContract = ERC721.bind(event.address)

    let callResult = collectionContract.try_tokenURI(event.params.tokenId);
    if (!callResult.reverted && callResult.value != '') {
      asset.tokenURI = callResult.value
    } else {
      let baseTokenURI = config ? config.get('baseTokenURI') : ''
      asset.tokenURI = baseTokenURI && baseTokenURI != '' ? baseTokenURI + event.params.tokenId.toString() : '--'
    }

    let baseImageURI = config ?  config.get('baseImageURI') : ''
    asset.imageURI = baseImageURI && baseImageURI != '' ? baseImageURI + event.params.tokenId.toString() : '--'

    asset.save()
  }

  return asset as Asset
}

function getOrCreateAccount(accountAddress: Address): Account {
  let accountId = accountAddress.toHex()

  let account = Account.load(accountId)
  if (account == null) {
    account = new Account(accountId)
    account.save()
  }


  return account as Account
}
