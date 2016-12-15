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
  private minefield: number[]
  constructor(private store: StoreService) { }

  ngOnInit(): void {
    this.title = 'Brainsweeper'
    this.store.combineReducers(reducer)
    this.store.dispatch({
      mode: 'normal'
    })
  }

  startGame(difficulty: string): void {
    this.store.dispatch({
      unlockState: true
    })
    this.store.dispatch({
      type: 'START',
      difficulty: difficulty
    })
    this.minefield = this.store.getState()['minefield']
    this.setSettings(difficulty)
  }

  setSettings(difficulty: string): void {
    switch (difficulty) {
      case 'beginner': this.gridSize = 81; this.rowLength = 9; this.mines = 10; break
      case 'intermediate': this.gridSize = 256; this.rowLength = 16; this.mines = 40; break
      case 'advanced': this.gridSize = 480; this.rowLength = 30; this.mines = 99; break
    }
  }

  handleClick(id: number): void {
    this.store.dispatch({
      type: 'CLICK',
      KEYPATHS_TO_CHANGE: [`minefield.${id}`],
      id: id
    })
    this.minefield = this.store.getState()['minefield']
    if (this.minefield[id]['isMine']) {
      this.store.dispatch({
        lockState: true
      })
    }
    else if (this.minefield[id]['adjacentMines'] === 0) {
      const validAdjacents = this.getValidAdjacents(this.minefield, id, this.rowLength)
      validAdjacents.forEach(adj => {
        if (this.minefield[adj]['isRevealed'] === false) this.handleClick(adj)
      })
    }
  }

  handleRClick(event: Event, id: number): void {
    event.preventDefault();
    console.log('inside handle r click');
  }

  getValidAdjacents(minefield: number[], tileId: number, rowLength: number): number[] {
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
}
