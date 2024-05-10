import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../model/course';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {

  @Input() courses: Course[] = [];
  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter(false);
  @Output() delete = new EventEmitter(false);

  
  readonly displayedColumns = ['name', 'category', 'actions'];

  constructor() { }

  getSummary(description: string): string {
    if (description.length > 100) {
      return description.substring(0, 100) + '...'; // Retorna os primeiros 40 caracteres seguidos de reticências
    }
    return description; // Retorna a descrição completa se ela tiver 40 caracteres ou menos
  }

  onAdd() {
    this.add.emit(true);
  }

  onEdit(course: Course) {
    this.edit.emit(course);
  }

  onDelete(course: Course) {
    this.delete.emit(course);
  }

  ngOnInit(): void { }

}
