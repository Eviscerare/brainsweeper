import { Component, OnInit, Input } from '@angular/core'
import { StoreService } from '../store.service'

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input() private tileId: number
  private isMine: boolean
  private isRevealed: boolean
  private isMarked: boolean
  private adjacentMines: number

  constructor(private store: StoreService) { }
  ngOnInit(): void {
    const unsub = this.store.subscribe(() => {
      const status = this.store.getState()['tiles'][this.tileId]
      this.isRevealed = status.isRevealed
      this.isMarked = status.isMarked
      if (this.isRevealed) unsub()
    }, `tiles.${this.tileId}`)
  }
}
