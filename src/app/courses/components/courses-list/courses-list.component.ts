import { VotoService } from './../../services/vote.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../model/course';
import { IpService } from '../../services/ip.service';

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

  @Input() course!: Course;
  public likes: number = 0;
  public dislikes: number = 0;
  public likeRegistered: boolean = false;
  public dislikeRegistered: boolean = false;
  public ipAddress!: string; // Adicione a variável para armazenar o endereço IP

  
  readonly displayedColumns = ['name', 'category', 'actions'];

  constructor(private voteService: VotoService, private ipService: IpService) {
    
  }
   registrarLike(cursoId: Course): void {
    this.voteService.registrarLike(cursoId._id, this.ipAddress).subscribe(() => {
      this.likes++;
      this.likeRegistered = true;
      setTimeout(() => this.likeRegistered = false, 3000); // Exibe a mensagem de confirmação por 3 segundos
    });
  }

  registrarDislike(cursoId: Course): void {
    this.voteService.registrarDislike(cursoId._id, this.ipAddress).subscribe(() => {
      this.dislikes++;
      this.dislikeRegistered = true;
      setTimeout(() => this.dislikeRegistered = false, 3000); // Exibe a mensagem de confirmação por 3 segundos
    });
  }

  getIpAddress(): void {
    this.ipService.getIpAddress().subscribe((data: any) => {
      this.ipAddress = data.ip;
    });
  }

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

  ngOnInit(): void {    this.getIpAddress();
  }

}
