import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Thesis, ThesisPart, CreateThesisDto, UpdateThesisPartDto, ThesisTree, FullThesis } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ThesisService {
  constructor(private http: HttpClient) {}

  createFromIdea(dto: CreateThesisDto): Observable<ApiResponse<Thesis>> {
    return this.http.post<ApiResponse<Thesis>>(`${environment.apiUrl}/theses/idea`, dto);
  }

  getTheses(): Observable<ApiResponse<Thesis[]>> {
    return this.http.get<ApiResponse<Thesis[]>>(`${environment.apiUrl}/theses`);
  }

  getThesisTree(id: string): Observable<ApiResponse<ThesisTree>> {
    return this.http.get<ApiResponse<ThesisTree>>(`${environment.apiUrl}/theses/${id}/tree`);
  }

  getFullThesis(id: string): Observable<ApiResponse<FullThesis>> {
    return this.http.get<ApiResponse<FullThesis>>(`${environment.apiUrl}/theses/${id}/full`);
  }

  getSection(id: string, section: string): Observable<ApiResponse<ThesisPart[]>> {
    return this.http.get<ApiResponse<ThesisPart[]>>(`${environment.apiUrl}/thesis/${id}/${section}`);
  }

  updatePart(id: string, key: string, dto: UpdateThesisPartDto): Observable<ApiResponse<ThesisPart>> {
    return this.http.patch<ApiResponse<ThesisPart>>(`${environment.apiUrl}/thesis/${id}/${key}`, dto);
  }

  getThesis(id: string): Observable<ApiResponse<Thesis>> {
    return this.http.get<ApiResponse<Thesis>>(`${environment.apiUrl}/theses/${id}`);
  }
}