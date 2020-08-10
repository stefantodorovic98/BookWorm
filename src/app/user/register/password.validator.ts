import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordCheckValidator : ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get("password").value;
  const passwordConfirmation = control.get("passwordConfirmation").value;
  if(password === passwordConfirmation) return null;
  else return {passError: "Passwords don't match"};
}
