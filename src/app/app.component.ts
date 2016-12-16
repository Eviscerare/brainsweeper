import { Component, OnInit } from '@angular/core'
import { StoreService } from './store.service'
import reducer from './app.reducers'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title: string
  private difficulty: string
  private gridSize: number
  private rowLength: number
  private mines: number
  private minefield: Object[]
  constructor(private store: StoreService) { }

  ngOnInit(): void {
    this.title = 'Brainsweeper'
    this.store.combineReducers(reducer)
    this.store.dispatch({
      mode: 'normal'
    })
  }

  startGame(difficulty: string): void {
    console.log('starting');
    this.store.dispatch({
      unlockState: true
    })
    this.store.dispatch({
      type: 'START',
      KEYPATHS_TO_CHANGE: [`minefield`],
      difficulty
    })
    this.minefield = this.store.getState()['minefield']
    this.setSettings(difficulty)
  }

  setSettings(difficulty: string): void {
    switch (difficulty) {
      case 'beginner': this.gridSize = 81; this.rowLength = 9; this.mines = 10; break
      case 'intermediate': this.gridSize = 256; this.rowLength = 16; this.mines = 40; break
      case 'advanced': this.gridSize = 480; this.rowLength = 30; this.mines = 50; break
      case 'ultimate': this.gridSize = 9801; this.rowLength = 99; this.mines = 999; break
    }
  }

  handleClick(id: number): void {
    if (this.minefield[id]['isMarked']) return
    if (this.minefield[id]['isRevealed']) return
    // this.store.dispatch({
    //   type: 'CLICK',
    //   KEYPATHS_TO_CHANGE: [`minefield.${id}`],
    //   id
    // })
    this.minefield[id]['isRevealed'] = true

    // TODO: Death array
    if (this.minefield[id]['isMine']) {
      this.store.dispatch({
        lockState: true
      })
      this.minefield = this.store.getState()['minefield']
    }
    else if (this.minefield[id]['adjacentMines'] === 0) {
      const validAdjacents = this.getValidAdjacents(this.minefield, id, this.rowLength)
      validAdjacents.forEach(adj => {
        if (this.minefield[adj]['isRevealed'] === false) this.handleClick(adj)
      })
    }
  }

  handleRClick(id: number): boolean {
    if (this.minefield[id]['isRevealed']) return false
    this.store.dispatch({
      type: 'MARK',
      KEYPATHS_TO_CHANGE: [`minefield.${id}`],
      id
    })
    this.minefield[id] = this.store.getState()['minefield'][id]
    return false
  }

  handleDblClick(id: number): boolean {

    const validAdjacents = this.getValidAdjacents(this.minefield, id, this.rowLength)
    validAdjacents.forEach(tile => {
      if (!this.minefield[tile]['isRevealed'] && !this.minefield[tile]['isMarked']) {
        if (validAdjacents.filter(dbladj => this.minefield[dbladj]['isMarked']).length >= this.minefield[id]['adjacentMines']) {
          this.handleClick(tile)
          this.minefield[tile] = this.store.getState()['minefield'][tile]
        }
      }
    })
    return false
  }

  getValidAdjacents(minefield: Object[], tileId: number, rowLength: number): number[] {
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
    if (tileId === minefield.length)
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
}
