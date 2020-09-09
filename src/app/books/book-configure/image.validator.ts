import { ValidatorFn, AbstractControl } from '@angular/forms';

export function ImageCheckValidator(ext: string[]):ValidatorFn{
  return (control: AbstractControl):{[key:string]:any} | null => {
    const file: File = control.value;
    if(file){
      const extension = file.name.split('.')[1].toLowerCase();
      let ret = null;
      for(let i=0;i<ext.length;i++){
        if(extension === ext[i]){
          return null;
        }
      }
      return {
        typeError: "Wrong file type"
      };
    }
    return null;
  };
}
