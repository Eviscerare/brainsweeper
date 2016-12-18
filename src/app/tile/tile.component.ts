import { Component, OnInit } from '@angular/core'
import { StoreService } from '../store.service'

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  private isMine: boolean
  private isRevealed: boolean
  private isMarked: boolean
  private adjacentMines: number

  constructor(private store: StoreService) { }
  ngOnInit(): void {
    this.adjacentMines = 0
  }
}