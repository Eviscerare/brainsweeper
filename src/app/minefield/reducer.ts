const tiles = (state = null, action) => {
  if (!state) state = generateMinefield(480, 99, 30)
  const tiles = Object.assign([], state)
  switch (action.type) {
    case 'CLICK':
      const id = action.id
      if (action.button === 'LEFT') reveal(tiles, id)
      if (action.button === 'RIGHT') mark(tiles, id)
      break
    default:
      return tiles
  }
  return state
}

const generateMinefield = (gridSize: number, mines: number, rowLength: number): Object[] => {
  const tiles = []
  const mineLocations = generateMineLocations(gridSize, mines)
  for (let i = 0; i < gridSize; i++) {
    tiles.push({
      tileId: i,
      isMine: mineLocations[i] ? true : false,
      isRevealed: false,
      isMarked: false,
      adjacentMines: 0
    })
  }
  const minefield = increaseAdjacencies(tiles, mineLocations, rowLength)
  return minefield
}

const generateMineLocations = (gridSize: number, mines: number): Object => {
  const mineLocations = {}
  let mineCount = 0
  while (mineCount < mines) {
    const idx = Math.floor(Math.random() * gridSize)
    if (!mineLocations[idx]) {
      mineLocations[idx] = true
      mineCount++
    }
  }
  return mineLocations
}

const increaseAdjacencies = (tiles: Object[], mineLocations: Object, rowLength: number): Object[] => {
  Object.keys(mineLocations).forEach(mine => {
    const valids = getValidAdjacents(tiles, +mine, rowLength)
    valids.forEach(id => tiles[id]['adjacentMines'] += 1)
  })
  return tiles
}

const getValidAdjacents = (tiles: Object[], tileId: number, rowLength: number): number[] => {
  const topLeft = tileId - rowLength - 1
  const topMid = tileId - rowLength
  const topRight = tileId - rowLength + 1
  const midLeft = tileId - 1
  const midRight = tileId + 1
  const botLeft = tileId + rowLength - 1
  const botMid = tileId + rowLength
  const botRight = tileId + rowLength + 1
  if (tileId === 0)
    return [midRight, botMid, botRight]
  if (tileId === rowLength - 1)
    return [midLeft, botLeft, botMid]
  if (tileId === tiles.length - rowLength)
    return [topMid, topRight, midRight]
  if (tileId === tiles.length - 1)
    return [topLeft, topMid, midLeft]
  if (tileId < rowLength)
    return [midLeft, midRight, botLeft, botMid, botRight]
  if (tileId > tiles.length - rowLength)
    return [topLeft, topMid, topRight, midLeft, midRight]
  if (tileId % rowLength === rowLength - 1)
    return [topLeft, topMid, midLeft, botLeft, botMid]
  if (tileId % rowLength === 0)
    return [topMid, topRight, midRight, botMid, botRight]
  return [topLeft, topMid, topRight, midLeft, midRight, botLeft, botMid, botRight]
}

const reveal = (tiles: Object[], id: number): void => {
  if (tiles[id]['isMine']) tiles.forEach(tile => {
    if (tile['isMine']) tile['isRevealed'] = true
    return
  })
  if (!tiles[id]['isMarked']) {
    tiles[id]['isRevealed'] = true
    if (tiles[id]['adjacentMines'] === 0) {
      const valids = getValidAdjacents(tiles, id, 30)
      valids.forEach(adj => {
        if (tiles[adj]['isRevealed'] === false) reveal(tiles, adj)
      })
    }
  }
}

const mark = (tiles: Object[], id: number): void => {
  tiles[id]['isMarked'] = tiles[id]['isMarked'] ? false : true
}

export default tiles
