import { Component, OnInit, Input } from '@angular/core'
import { StoreService } from '../store.service'

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input() private tile: Object

  constructor(private store: StoreService) { }

  ngOnInit(): void {

  }
}
