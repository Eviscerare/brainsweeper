const minefield = (state = [], action) => {
  const field = Object.assign([], state)
  switch (action.type) {
    case 'START':
      let gridSize, rowLength, mines
      switch (action.difficulty) {
        case 'beginner':
          gridSize = 81; rowLength = 9; mines = 10; break
        case 'intermediate':
          gridSize = 256; rowLength = 16; mines = 40; break
        case 'advanced':
          gridSize = 480; rowLength = 30; mines = 99; break
      }
      return generateMinefield(gridSize, mines, rowLength)
    case 'CLICK':
      const id = action.id
      if (field[id].isMine) {
        field.forEach(tile => {
          tile.isMine ? tile.isRevealed = true : false
        })
      }
      field[id].isRevealed = true
      return field
    default:
      return field
  }
}

const generateMinefield = (gridSize: number, mines: number, rowLength: number): number[] => {
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

const getValidAdjacents = (minefield: number[], tileId: number, rowLength: number): number[] => {
  const topLeft = +tileId - rowLength - 1
  const topMid = +tileId - rowLength
  const topRight = +tileId - rowLength + 1
  const midLeft = +tileId - 1
  const midRight = +tileId + 1
  const botLeft = +tileId + rowLength - 1
  const botMid = +tileId + rowLength
  const botRight = +tileId + rowLength + 1
  const adjacents = [topLeft, topMid, topRight, midLeft, midRight, botLeft, botMid, botRight]
  let validAdjacents = adjacents.filter((pos: number) => 0 <= pos && pos < minefield.length)
  if (tileId % rowLength === rowLength - 1)
    validAdjacents = validAdjacents.filter((pos: number) => pos !== topRight && pos !== midRight && pos !== botRight)
  if (tileId % rowLength === 0)
    validAdjacents = validAdjacents.filter((pos: number) => pos !== topLeft && pos !== midLeft && pos !== botLeft)
  return validAdjacents
}

const increaseAdjacencies = (minefield: number[], mineLocations: Object, rowLength: number): void => {
  Object.keys(mineLocations).forEach((mine: any) => {
    const validAdjacents = getValidAdjacents(minefield, mine, rowLength)
    validAdjacents.forEach((pos: number) => {
      if (!minefield[pos]['isMine']) minefield[pos]['adjacentMines'] += 1
    })
  })
}

const reducer = {
  minefield
}

export default reducer
