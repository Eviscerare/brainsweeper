import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { StoreService } from './store.service'
import { AppComponent } from './app.component'
import { MinefieldComponent } from './minefield/minefield.component'
import { TileComponent } from './tile/tile.component'

@NgModule({
  declarations: [
    AppComponent,
    MinefieldComponent,
    TileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ StoreService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
