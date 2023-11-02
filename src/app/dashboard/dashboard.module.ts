import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuhtGuard } from "../auth/auth.guard";
import { DashboardComponent } from "./dashboard.component";

@NgModule({
    declarations:[DashboardComponent],
    imports:[
        CommonModule,
        RouterModule.forChild([ {path: 'dashboard' , component: DashboardComponent, canActivate:[AuhtGuard]}]),
    ]
})
export class dashboardModule {}