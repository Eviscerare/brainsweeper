import { Component, OnInit, Input } from '@angular/core'
import { StoreService } from '../store.service'

@Component({
  selector: 'minefield',
  templateUrl: './minefield.component.html',
  styleUrls: ['./minefield.component.css']
})
export class MinefieldComponent implements OnInit {
  @Input('gridSize') private gridSize: number
  @Input('rowLength') private rowLength: number
  @Input('mines') private mines: number
  private mineLocations: Object
  private tiles: number[]

  constructor(private store: StoreService) { }

  ngOnInit(): void {
    this.generateMineLocations()
    this.renderTiles()
  }

  generateMineLocations(): void {
    const mineLocations = {}
    let mineCount = 0
    while (mineCount < this.mines) {
      const idx = Math.floor(Math.random() * this.gridSize)
      if (!mineLocations[idx]) {
        mineLocations[idx] = true
        mineCount++
      }
    }
    this.mineLocations = mineLocations
  }

  renderTiles(): void {
    this.tiles = []
    for (let i = 0; i < this.gridSize; i++) {
      this.tiles.push(i)
    }
  }
}