import { Component, OnInit } from '@angular/core'
import { StoreService } from './store.service'
import mainReducer from './app.reducers'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title: string
  private minefield: number[]
  private mines: number
  private gridSize: number
  private width: string = '560px'
  constructor(private store: StoreService) {

  }

  handleClick(event): void {
    this.store.dispatch({
      type: 'CLICK',
      id: event.target.id
    })
  }

  ngOnInit(): void {
    this.title = 'Brainsweeper'
    this.store.combineReducers(mainReducer)
    this.minefield = this.store.getState()['minefield']
  }
}
