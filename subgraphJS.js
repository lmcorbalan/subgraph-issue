module.exports = {
  specVersion: '0.0.2',
  description: 'NFTfi',
  repository: 'https://github.com/NFTfi-Genesis/nftfi-subgraph',
  schema: {
    file: './schema.graphql',
  },
  dataSources: [
    {
      kind: 'ethereum/contract',
      name: '',
      network: 'rinkeby',
      source: {
        address: '0xfdf703b22a13f825d348af43d2bfc140054d0e3d',
        startBlock: 5816251,
        abi: 'ERC721',
      },
      mapping: {
        kind: 'ethereum/events',
        apiVersion: '0.0.5',
        language: 'wasm/assemblyscript',
        file: './src/erc721.ts',
        entities: ['Account, Asset, Collection'],
        abis: [
          {
            name: 'ERC721',
            file: './abis/ERC721.json',
          }
        ],
        eventHandlers: [
          {
            event: 'Transfer(indexed address,indexed address,indexed uint256)',
            handler: 'handleTransfer',
          }
        ],
      }
    }
  ]
}
