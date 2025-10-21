import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
   host: { 'ngSkipHydration': '' },
})
export class LoginHome {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(){
  console.log('[login] submit', this.form.value);       
  if (this.form.invalid) return;

  this.loading = true; this.error = null;
  const { email, password } = this.form.value as { email:string; password:string };

  this.auth.login(email, password).subscribe({
    next: (resp) => {
      console.log('[login] resp', resp);
      this.auth.saveSession(resp);
      const role = this.auth.roleId;
      console.log('[login] role', role);



      if (role === 1) this.router.navigate(['/cliente']);
      else if (role === 2) this.router.navigate(['/gerente']);
      else if (role === 3) this.router.navigate(['/ejecutivo']);
      else this.router.navigate(['/login']);
    },
    error: (e) => {
      console.error('[login] error', e);
      this.error = e?.error?.error || 'Error de autenticación';
      this.loading = false;
    },
    complete: () => this.loading = false
  });
  }}
