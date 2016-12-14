const initialState = {
  gridSize: 0,
  mines: 0,
  minefield: []
}
const minefield = (state = null, action) => {
  console.log('inside minefield reducer');
  if (!state) {
    const mineLocations = generateMineLocations(256, 40)
    const minefield = []
    for (let i = 0; i < 256; i++) {
      minefield.push(mineLocations[i] ? 1 : 0)
    }
    return minefield
  }
  switch (action.type) {
    case 'CLICK':
      const id = action.id
      console.log('clicked with', id)
    default:
      return state
  }
}

const mainReducer = {
  minefield,
  // brain: () => {
  //   switch (action.type) {
  //     case 'START':
  //       const newState = Object.assign({}, initialState)
  //       newState.gridSize = 256
  //       for (let i = 0; i < newState.gridSize; i++)
  //         newState.minefield.push(mineLocations[i] ? 1 : 0)
  //       return newState
  //     default:
  //       return state
  //   }
  // }
}

const generateMineLocations = (gridSize: number, mines: number): {} => {
  const mineLocations = {}
  for (let i = 0; i < mines; i++) {
    let exists = false
    do {
      const idx = Math.floor(Math.random() * gridSize)
      if (!mineLocations[idx]) {
        mineLocations[idx] = true
        exists = true
      }
    } while (!exists)
  }
  return mineLocations
}

export default mainReducer
