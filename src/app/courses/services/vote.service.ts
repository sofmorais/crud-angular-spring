import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Vote } from '../model/vote';

@Injectable({
  providedIn: 'root'
})
export class VotoService {
  private baseUrl = 'http://localhost:8080/votes';
  private readonly API = 'api/votes';


  constructor(private http: HttpClient) { }

  registrarLike(courseId: string, ipAddress: string): Observable<Vote> {
    const headers = new HttpHeaders().set('X-Forwarded-For', ipAddress);

    return this.http.post<Vote>(`${this.API}/like?courseId=${courseId}`, {},  { headers });
  }

  registrarDislike(courseId: string, ipAddress: string): Observable<Vote> {
    const headers = new HttpHeaders().set('X-Forwarded-For', ipAddress);

    return this.http.post<Vote>(`${this.API}/dislike?courseId=${courseId}`, {},  { headers });
  }
}