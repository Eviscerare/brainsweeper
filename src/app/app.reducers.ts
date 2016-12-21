const minefield = (state = [], action) => {
  const field = Object.assign([], state)
  let id
  switch (action.type) {
    case 'START':
      let gridSize, rowLength, mines
      switch (action.difficulty) {
        case 'beginner': gridSize = 81; rowLength = 9; mines = 10; break
        case 'intermediate': gridSize = 256; rowLength = 16; mines = 40; break
        case 'advanced': gridSize = 480; rowLength = 30; mines = 50; break
        case 'ultimate': gridSize = 9801; rowLength = 99; mines = 999; break
      }
      return generateMinefield(gridSize, mines, rowLength)
    case 'CLICK':
      id = action.id
      if (field[id].isMine) {
        field.forEach(tile => {
          tile.isMine ? tile.isRevealed = true : false
        })
      }
      field[id].isRevealed = true
      return field
    case 'MARK':
      id = action.id
      field[id].isMarked = field[id].isMarked ? false : true
      return field
    default:
      return field
  }
}

const generateMinefield = (gridSize: number, mines: number, rowLength: number): Object[] => {
  const minefield = []
  const mineLocations = generateMineLocations(gridSize, mines)
  for (let i = 0; i < gridSize; i++) {
    const tile = {
      id: i,
      isMine: mineLocations[i] ? true : false,
      isRevealed: false,
      isMarked: false,
      adjacentMines: 0
    }
    minefield.push(tile)
  }
  increaseAdjacencies(minefield, mineLocations, rowLength)
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

const getValidAdjacents = (minefield: Object[], tileId: number, rowLength: number): number[] => {
  const topLeft = +tileId - rowLength - 1
  const topMid = +tileId - rowLength
  const topRight = +tileId - rowLength + 1
  const midLeft = +tileId - 1
  const midRight = +tileId + 1
  const botLeft = +tileId + rowLength - 1
  const botMid = +tileId + rowLength
  const botRight = +tileId + rowLength + 1
  if (tileId === 0)
    return [midRight, botMid, botRight]
  if (tileId === rowLength - 1)
    return [midLeft, botLeft, botMid]
  if (tileId === minefield.length - rowLength)
    return [topMid, topRight, midRight]
  if (tileId === minefield.length - 1)
    return [topLeft, topMid, midLeft]
  if (tileId < rowLength)
    return [midLeft, midRight, botLeft, botMid, botRight]
  if (tileId > minefield.length - rowLength)
    return [topLeft, topMid, topRight, midLeft, midRight]
  if (tileId % rowLength === rowLength - 1)
    return [topLeft, topMid, midLeft, botLeft, botMid]
  if (tileId % rowLength === 0)
    return [topMid, topRight, midRight, botMid, botRight]
  return [topLeft, topMid, topRight, midLeft, midRight, botLeft, botMid, botRight]
}

const increaseAdjacencies = (minefield: Object[], mineLocations: Object, rowLength: number): void => {
  Object.keys(mineLocations).forEach((mine: any) => {
    const validAdjacents = getValidAdjacents(minefield, +mine, rowLength)
    validAdjacents.forEach((pos: number) => {
      if (!minefield[pos]['isMine']) minefield[pos]['adjacentMines'] += 1
    })
  })
}

const reducer = {
  minefield
}

export default reducer
