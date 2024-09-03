import { createInjectableType } from '@angular/compiler';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


// function equalValues(control:AbstractControl){
//   const passsword = control.get('password')?.value;
//   const confrmPassword = control.get('confrmPassword')?.value;

//   if(passsword === confrmPassword){
//     return null;
//   }

//   return {passwordsNotEqual: true}
// }

function equalValues(controlName1:string, controlName2:string){
  return (control:AbstractControl)=>{
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if(val1 === val2){
      return null;
    }

    return {valuesNotEqual: true}
  }
  
}


@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports:[ReactiveFormsModule]
})
export class SignupComponent {


  signUpForm = new FormGroup({
    email: new FormControl('',{
      validators:[Validators.required,Validators.email]
    }),
    passwords:new FormGroup({
      password: new FormControl('',{
        validators:[Validators.required,Validators.minLength(6),Validators.maxLength(10)]
      }),
      confrmPassword:new FormControl('',{
        validators:[Validators.required]
        //customValidators
      })
    },{validators:[equalValues('password','confrmPassword' )]}),
    

    firstName:new FormControl('',{
      validators:[Validators.required]
    }),
    lastName:new FormControl('',{
      validators:[Validators.required]
    }),
    address:new FormGroup({
      street: new FormControl('',{
        validators:[Validators.required]
      }),
      number: new FormControl('',{
        validators:[Validators.required]
      }),
      postalcode:new FormControl('',{
        validators:[Validators.required]
      }),
      city:new FormControl('',{
        validators:[Validators.required]
      })
    }),
    
    role:new FormControl<'student'|'teacher'|'employee'|'founder'|'other'>('student',{
      validators:[Validators.required]
    }),
    source:new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ]),
    
  });

  onSubmit(){
    console.log(this.signUpForm.value);

  }
  onReset(){
    this.signUpForm.reset();
  }
}
