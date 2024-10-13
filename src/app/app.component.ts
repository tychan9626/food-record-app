import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectFoodComponent } from "./select-food/select-food.component";
import { ConfigPanelComponent } from "./config-panel/config-panel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, SelectFoodComponent, ConfigPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

}
