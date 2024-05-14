import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../model/course';
import { delay, first, tap } from 'rxjs/operators';
import { Vote } from '../model/vote';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses';

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Course[]>(this.API)
      .pipe(
        first()
        // delay(2000),
        // tap(courses => console.log(courses))
      );
  }

  loadById(id: string) {
    return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  save(record: Partial<Course>) {
    if(record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(record: Partial<Course>) {
    return this.httpClient.post<Course>(this.API, record);
  }

  private update(record: Partial<Course>) {
    return this.httpClient.put<Course>(`${this.API}/${record._id}`, record);
  }

  delete(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`);
  }

  loadVotesForCourse(courseId: string): Observable<Vote[]> {
    return this.httpClient.get<Vote[]>(`${this.API}/courses/${courseId}/votes`);
    // Substitua '/courses/${courseId}/votes' pela rota correta para carregar os votos de um curso
  }

}
