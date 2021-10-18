import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'home', loadChildren: ()=> import('./features/home/home.module').then(m=>m.HomeModule) },
  {path:'register', loadChildren: ()=> import('./features/account/account.module').then(m=>m.AccountModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing: false} as ExtraOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
