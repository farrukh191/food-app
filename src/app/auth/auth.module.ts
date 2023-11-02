import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { AuthComponent } from "./auth.component";
import { CommonModule } from '@angular/common';  

@NgModule({
    declarations:[AuthComponent],
    imports:[
        CommonModule,
        NzButtonModule,
        NzLayoutModule,
        NzFormModule,
        ReactiveFormsModule,
        NzInputModule,
        RouterModule.forChild([ {path: '' , component: AuthComponent}]),
    ]
})
export class AuthModule {}