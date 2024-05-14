import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { Course } from '../model/course';
import { map, switchMap } from 'rxjs/operators';
import { Vote } from '../model/vote';

@Injectable({
  providedIn: 'root'
})
export class CourseResolver implements Resolve<Course> {

  constructor(private service: CoursesService) {  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
    if(route.params?.['id']) {
      return this.service.loadById(route.params['id']).pipe(
        switchMap((course: Course) => {
          // Aqui você pode carregar os votos associados ao curso
          return this.service.loadVotesForCourse(course._id).pipe(
            map((votes: Vote[]) => {
              course.votes = votes; // Adiciona os votos ao curso
              return course; // Retorna o curso completo com os votos
            })
          );
        })
      );
    }
    return of({_id: '', name: '', description: '', category: ''});
  }
}
