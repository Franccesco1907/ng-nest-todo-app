import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ITodo } from '../models';


@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = environment.apiUrl + '/todos';

  constructor(private http: HttpClient) { }

  getTodos(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(this.apiUrl);
  }

  getTodoById(id: string): Observable<ITodo> {
    return this.http.get<ITodo>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: Omit<ITodo, 'id'>): Observable<ITodo> {
    return this.http.post<ITodo>(this.apiUrl, todo);
  }

  updateTodo(id: string, todo: Omit<ITodo, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Observable<ITodo> {
    return this.http.patch<ITodo>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAsCompleted(ids: string[]): Observable<ITodo[]> {
    return this.http.patch<ITodo[]>(`${this.apiUrl}/complete`, { ids });
  }
}