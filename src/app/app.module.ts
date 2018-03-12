import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {IntoPipeModule} from 'into-pipes';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FlexibleTableModule } from './flexible-table/flexible-table-module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    IntoPipeModule,
    HttpModule,
    FlexibleTableModule
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
