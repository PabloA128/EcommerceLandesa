import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatRadioModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isWorkshop = false;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  hideWorkshopPassword = true;
  hideWorkshopConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      userType: ['user', Validators.required],
      // Campos para usuario normal
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // Campos para taller
      workshopName: [''],
      workshopEmail: [''],
      workshopPhone: [''],
      workshopAddress: [''],
      workshopPassword: [''],
      workshopConfirmPassword: ['']
    });

    // Escuchar cambios en el tipo de usuario
    this.registerForm.get('userType')?.valueChanges.subscribe(value => {
      this.isWorkshop = value === 'workshop';
      this.updateValidators();
    });
  }

  updateValidators() {
    if (this.isWorkshop) {
      // Validaciones para taller
      this.registerForm.get('workshopName')?.setValidators([Validators.required]);
      this.registerForm.get('workshopEmail')?.setValidators([Validators.required, Validators.email]);
      this.registerForm.get('workshopAddress')?.setValidators([Validators.required]);
      this.registerForm.get('workshopPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.registerForm.get('workshopConfirmPassword')?.setValidators([Validators.required]);

      // Limpiar validaciones de usuario normal
      this.registerForm.get('firstName')?.clearValidators();
      this.registerForm.get('lastName')?.clearValidators();
      this.registerForm.get('email')?.clearValidators();
      this.registerForm.get('address')?.clearValidators();
      this.registerForm.get('password')?.clearValidators();
      this.registerForm.get('confirmPassword')?.clearValidators();
    } else {
      // Validaciones para usuario normal
      this.registerForm.get('firstName')?.setValidators([Validators.required]);
      this.registerForm.get('lastName')?.setValidators([Validators.required]);
      this.registerForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.registerForm.get('address')?.setValidators([Validators.required]);
      this.registerForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.registerForm.get('confirmPassword')?.setValidators([Validators.required]);

      // Limpiar validaciones de taller
      this.registerForm.get('workshopName')?.clearValidators();
      this.registerForm.get('workshopEmail')?.clearValidators();
      this.registerForm.get('workshopAddress')?.clearValidators();
      this.registerForm.get('workshopPassword')?.clearValidators();
      this.registerForm.get('workshopConfirmPassword')?.clearValidators();
    }

    // Actualizar validaciones
    this.registerForm.get('firstName')?.updateValueAndValidity();
    this.registerForm.get('lastName')?.updateValueAndValidity();
    this.registerForm.get('email')?.updateValueAndValidity();
    this.registerForm.get('address')?.updateValueAndValidity();
    this.registerForm.get('password')?.updateValueAndValidity();
    this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    this.registerForm.get('workshopName')?.updateValueAndValidity();
    this.registerForm.get('workshopEmail')?.updateValueAndValidity();
    this.registerForm.get('workshopAddress')?.updateValueAndValidity();
    this.registerForm.get('workshopPassword')?.updateValueAndValidity();
    this.registerForm.get('workshopConfirmPassword')?.updateValueAndValidity();
  }

  passwordsMatch(): boolean {
    if (this.isWorkshop) {
      const password = this.registerForm.get('workshopPassword')?.value;
      const confirmPassword = this.registerForm.get('workshopConfirmPassword')?.value;
      return password === confirmPassword;
    } else {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;
      return password === confirmPassword;
    }
  }

  onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch()) {
      this.isLoading = true;
      
      const formData = this.registerForm.value;
      const registerRequest: RegisterRequest = {
        userType: formData.userType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        workshopName: formData.workshopName,
        workshopEmail: formData.workshopEmail,
        workshopPhone: formData.workshopPhone,
        workshopAddress: formData.workshopAddress,
        workshopPassword: formData.workshopPassword,
        workshopConfirmPassword: formData.workshopConfirmPassword
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.snackBar.open(response.message, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open(response.message, 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en el registro:', error);
          this.snackBar.open('Error al registrar usuario. Inténtalo de nuevo.', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Ingresa un email válido';
    }
    if (field?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
} 