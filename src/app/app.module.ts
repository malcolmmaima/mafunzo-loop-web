import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from "./sidebar/sidebar.module";
import { FooterModule } from "./shared/footer/footer.module";
import { NavbarModule } from "./shared/navbar/navbar.module";
import { FixedPluginModule } from "./shared/fixedplugin/fixedplugin.module";
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routing";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { VerificationComponent } from "./verification/verification.component";

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    FixedPluginModule,
  ],
  declarations: [AppComponent, AdminLayoutComponent, VerificationComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
