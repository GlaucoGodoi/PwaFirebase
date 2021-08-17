import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'home', loadChildren: ()=> import('./features/home/home.module').then(m=>m.HomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{enableTracing:false} as ExtraOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }