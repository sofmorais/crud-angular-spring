import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// TODO: `Help - Lazy loading
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'courses' },
  { path: 'courses',
    loadChildren: () => import ('./courses/courses.module').then(module => module.CoursesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
