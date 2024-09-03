import { afterNextRender, Component, DestroyRef, OnInit, viewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';


function mustContainQuestionMark(control:AbstractControl){
  if(control.value.includes('?')){
    return null;
  }
  return{
    doesNotContainQuestionMark:true
  }
}
function emailIsUnique(control:AbstractControl){
  if(control.value !== 'test@example.com'){
    return of(null);
  }
  return of({notUnique:true})
}

//update form
let initEmailValue = '';
const savedForm = window.localStorage.getItem("saved-login-form");
if(savedForm){
  const loadedForm = JSON.parse(savedForm);
  //update ovarall form(patchValue with reactive forms)
  // this.loginForm.patchValue({email:loadedForm.email});
  initEmailValue=loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports:[FormsModule,ReactiveFormsModule]
})
//=============================================reactive forms=======================================//

export class LoginComponent implements OnInit{


  constructor(private _DestroyRef:DestroyRef){}

  loginForm =new FormGroup({
    email:new FormControl(initEmailValue,{
      validators:[Validators.email,Validators.required],
      asyncValidators:[emailIsUnique]
    }),
    password:new FormControl('',{
      validators:[Validators.required,Validators.minLength(6),Validators.maxLength(10),mustContainQuestionMark],
      
    })
  });

  get emailIsInvalid(){
    return (
      this.loginForm.controls.email.touched &&
      this.loginForm.controls.email.dirty &&
      this.loginForm.controls.email.invalid
    )
  };
  get passwordIsInvalid(){
    return (
      this.loginForm.controls.password.touched &&
      this.loginForm.controls.password.dirty &&
      this.loginForm.controls.password.invalid
    )
  }
  ngOnInit():void{
  
    const subscribtion = this.loginForm.valueChanges.pipe(debounceTime(500)).subscribe({
      next:(value)=>{
        window.localStorage.setItem('saved-login-form',JSON.stringify({email:value.email}))
      },
    });
    this._DestroyRef.onDestroy(()=>{
      subscribtion.unsubscribe();
    })
  }
  onSubmit(){
    //console.log(this.loginForm);
    const enteredEmail = this.loginForm.value.email;
    const enteredPassword = this.loginForm.value.password;
    console.log(enteredEmail,enteredPassword);
    
    
  }
}

//=============================================template driven=======================================//
/*export class LoginComponent {
 //access form to remain input data if we reload the page
private form = viewChild.required<NgForm>('form');


constructor(private destroyRef:DestroyRef){
  //new hook
  afterNextRender(()=>{
    //updating form programaticly
    const savedForm = window.localStorage.getItem('saved-login-form');
    if(savedForm){
      const loadedFormData = JSON.parse(savedForm)
      const savedEmail = loadedFormData.email;
      //error with setValue  without setTimeOut
      // this.form().setValue({
      //   email:savedEmail,
      //   password:''
      // })
      setTimeout(()=>{
        this.form().controls['email'].setValue(savedEmail);
    },1)
    
    }
    //emit value with every change
    //emit value with every changes after  certin time(debounceTime)
    //يعني هيحفظ الداتا بعد لما اليوزر يوقف كتابه بوقت محدد
    const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
      next:(value)=>{
        console.log(value.email);
        window.localStorage.setItem('saved-login-form',JSON.stringify({email:value.email}))
      }
    });

    this.destroyRef.onDestroy(()=>{
      subscription?.unsubscribe();
    })
  })
}


  onSubmit(formData:NgForm){
    if(formData.form.invalid){
      return ;
    }
    
    const email = formData.form.value.email;
    const password = formData.form.value.password;
    console.log(email, password);
    formData.form.reset();
    //be input empty adding ng-invalid ng-prisine ng-untouched  arritbutes
    }


//==========================Html==========================//

    <form #form="ngForm" (ngSubmit)="onSubmit(form)">
  <h2>Login</h2>

  <div class="control-row">
    <div class="control no-margin">
      <label for="email">Email</label>
      <input id="email" type="email" name="email"
       ngModel required email #email="ngModel"/>
    </div>

    <div class="control no-margin">
      <label for="password">Password</label>
      <input id="password" type="password" name="password" 
      ngModel  required  minlength="6" #password="ngModel"/>
    </div>

    <button class="button"  >Login</button>
  </div>
  <!-- 
  classes adding by angular we use it for vaidation
  ng-pristine =>not recive any input
  ng-invalid => currently considerd valid or not
  ng-touched => user not selected inputs field
  -->
  <!-- #form=ngForm   #email=ngModel   #password=ngModel -->
  <!-- @if(form.form.invalid && email.touched && password.touched){
    <p class="controll-error">Invalid Values Detected. Please chech your input</p>
  } -->
  @if(email.invalid && email.touched && email.dirty){
    <p class="controll-error">Invalid Email Address Entered</p>
  }
  @if(password.invalid && password.touched && password.dirty){
    <p class="controll-error">Invalid Password Entered</p>
  }
</form>
}*/
