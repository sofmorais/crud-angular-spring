import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, take } from 'rxjs/operators';
import { CategoriaDTO } from '../../model/categoriadto';
import { MatCheckbox } from '@angular/material/checkbox';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormGroup): boolean {
    return !!(control && control.invalid && (control.dirty));
  }
}
@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  checked = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl('');
  /* filteredCategories: Observable<string[]>;
 categories: string[] = [];
 allCategories: string[] = ['Frontend', 'Backend', 'Exemplo', 'Exemplo 2', 'Exemplo 3', 'Exemplo 4', 'Exemplo 5'];  */
  form: FormGroup;
  matcher = new MyErrorStateMatcher();

  filteredCategories: Observable<CategoriaDTO[]>; // Alterado o tipo de observável
  categories: CategoriaDTO[] = []; // Alterado o tipo do array de categorias
  allCategories: CategoriaDTO[] = [ // Alterado o tipo do array de todas as categorias
    { nome: 'Frontend' },
    { nome: 'Backend' },
    { nome: 'Exemplo 1' },
    { nome: 'Exemplo 2' },
    { nome: 'Exemplo 3' },
  ];

  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  @ViewChild('autocompleteTrigger') matACTrigger!: MatAutocompleteTrigger;
  @ViewChild('selectAllOption', { static: true }) selectAllOption!: MatOption; // Reference to the "Select All" option

  constructor(
    private formBuilder: FormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute) {

    this.form = this.formBuilder.group({
      _id: [''],
      name: ['', [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(250)]],
      category: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: any | null) => (category ? this._filter(category) : this.allCategories.slice())),
    );

    /* this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      debounceTime(300),
      map((search) => this.categories.filter((category) => category.nome.toLowerCase().includes(search!.toLowerCase())))
    ); */
  }

  remove(category: CategoriaDTO) {
    const index = this.categories.indexOf(category);
    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.allCategories.filter(category => category.nome.toLowerCase().includes(filterValue));
  }

  /*  toggleCategory(category: CategoriaDTO) {
     const index = this.categories.findIndex(cat => cat.nome == category.nome);
     if (index >= 0) {
       // Se a categoria já estiver presente, remova-a
       this.categories.splice(index, 1);
     } else {
       // Se a categoria não estiver presente, adicione-a
       this.categories.push(category);
     }
   }  */

 selected(event: MatAutocompleteSelectedEvent): void {
    const newValue = event.option.value;
    const index = this.categories.findIndex(cat => cat.nome === newValue.nome);
    
    if (newValue === 'selectAll') {
      this.selectAlls();
    } else {
      if (index >= 0) {
        this.categories.splice(index, 1);
      } else {
        this.categories.push(newValue);
      }
    }

    this.categoryInput.nativeElement.value = '';
    requestAnimationFrame(() => {
      this.openAuto(this.matACTrigger);
    });
  }

  selectAlls() {
    this.filteredCategories.pipe(take(1)).subscribe(categories => {
      const allSelected = this.categories.length === categories.length;

      if (allSelected || this.categories.length > 0) {
        this.categories = [];
      } else {
        this.categories = categories.slice();
      }
    });
  }



  // Método para verificar se uma categoria está selecionada
  isCategorySelected(category: CategoriaDTO): boolean {
    return this.categories.some(cat => cat.nome == category.nome);
  }

  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.categoryInput.nativeElement.focus();
  }


  handleInput(event: KeyboardEvent) {
    if ((event.target as HTMLInputElement).value === '') {
      this.form.get('name')?.markAsPristine();
    }
  }


  onSubmit() {
    this.service.save(this.form.value).subscribe({
      next: () => this.onSucess(),
      error: () => this.onError()
    });
  }

  onCancel() {
    this.location.back();
  }

  private onSucess() {
    this.snackBar.open('Curso salvo com sucesso.', '', { duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar curso.', '', { duration: 5000 });
  }

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (field?.hasError('minlength')) {
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Esse campo precisa ter no mínimo ${requiredLength} caracteres.`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `Tamanho máximo excedido. Máximo: ${requiredLength} caracteres.`;
    }

    return 'Campo inválido'
  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form.setValue({
      _id: course._id,
      name: course.name,
      category: course.category,
      description: course.description
    });
  }
}