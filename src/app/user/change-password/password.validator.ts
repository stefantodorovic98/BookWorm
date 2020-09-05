import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordCheckValidator : ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get("newPassword").value;
  const passwordConfirmation = control.get("newPasswordConfirmation").value;
  if(password === passwordConfirmation) return null;
  else return {passError: "Passwords don't match"};
}
