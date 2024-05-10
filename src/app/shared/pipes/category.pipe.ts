import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
// TODO: `Help: pipe
export class CategoryPipe implements PipeTransform {

  transform(value: string): string {
    switch(value){
      case 'front-end': return 'code';
      case 'back-end': return 'computer';
    }
    return 'code';
  }

}
