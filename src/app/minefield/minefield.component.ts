import { Component, OnInit, Input } from '@angular/core'
import { StoreService } from '../store.service'

@Component({
  selector: 'minefield',
  templateUrl: './minefield.component.html',
  styleUrls: ['./minefield.component.css']
})
export class MinefieldComponent implements OnInit {
  private gridSize: number = 480
  private rowLength: number = 30
  private mines: number = 99
  private mineLocations: Object
  private tiles: Object[]

  constructor(private store: StoreService) { }

  ngOnInit(): void {
    const tiles = (state = null, action) => {

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

      const increaseAdjacencies = (tiles: Object[], mineLocations: Object): void => {
        Object.keys(mineLocations).forEach(mine => {
          const valids = getValidAdjacents(tiles, +mine, 99)
          valids.forEach(id => {
            tiles[id]['adjacentMines'] += 1
          })
        })
      }

      const getValidAdjacents = (tiles: Object[], tileId: number, rowLength: number): number[] => {
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

      if (!state) {
        const tiles = []
        const mineLocations = generateMineLocations(480, 99)
        for (let i = 0; i < 480; i++) {
          tiles.push({
            tileId: i,
            isMine: mineLocations[i] ? true : false,
            isRevealed: true,
            isMarked: false,
            adjacentMines: 0
          })
        }
        console.log('hi');
        increaseAdjacencies(tiles, mineLocations)
        return tiles
      }
      switch (action.type) {
        case 'CLICK':
          if (action.button === 'LEFT') state[action.id]['isRevealed'] = true
          if (action.button === 'RIGHT') state[action.id]['isMarked'] = true
          break
        default:
          return state
      }
      return state
    }
    this.store.dispatch({
      mode: 'normal'
    })
    this.store.combineReducers({ tiles })
    this.tiles = this.store.getState()['tiles']
  }

  handleClick(id: number): void {
    this.store.dispatch({
      type: 'CLICK',
      button: 'LEFT',
      KEYPATHS_TO_CHANGE: [`tiles.${id}`],
      id
    })
  }

  handleRClick(id: number): void {
    this.store.dispatch({
      type: 'CLICK',
      button: 'RIGHT',
      KEYPATHS_TO_CHANGE: [`tiles.${id}`],
      id
    })
  }

  handleDblClick(id: number): void {

  }
}