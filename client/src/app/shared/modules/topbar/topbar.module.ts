import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core"
import { TopbarComponent } from "./components/topbar.component";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [TopbarComponent],
  exports: [TopbarComponent]
})
export class TopbarModule {}