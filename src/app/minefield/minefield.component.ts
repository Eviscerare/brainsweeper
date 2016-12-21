import { Component, OnInit, Input } from '@angular/core'
import { StoreService } from '../store.service'
import tiles from './reducer'

@Component({
  selector: 'minefield',
  templateUrl: './minefield.component.html',
  styleUrls: ['./minefield.component.css']
})
export class MinefieldComponent implements OnInit {
  private tiles: Object[]
  private markCount: number = 0
  private listeners: number = 0
  private revealed: number = 0

  constructor(private store: StoreService) { }

  ngOnInit(): void {
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
    this.revealed = this.tiles.filter(tile => tile['isRevealed']).length
    this.calculateListeners()
  }

  calculateListeners(): void {
    this.listeners = this.markCount + this.revealed
  }

  handleRClick(id: number): boolean {
    this.store.dispatch({
      type: 'CLICK',
      button: 'RIGHT',
      KEYPATHS_TO_CHANGE: [`tiles.${id}`],
      id
    })
    this.markCount += 1
    this.calculateListeners()
    return false
  }
}