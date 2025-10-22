# Développement du Frontend avec Angular 20

## Qu'est-ce qu'Angular ?

Si votre application était une maison, Angular serait l'ensemble de l'architecture intérieure et des systèmes visibles : les murs, les pièces, l'électricité, la plomberie, et même la décoration. C'est un framework complet qui fournit tout ce dont vous avez besoin pour construire des applications web riches et interactives.

Angular 20 est la version la plus récente, offrant des performances améliorées et de nouvelles fonctionnalités par rapport aux versions précédentes.

## Structure d'une application Angular

Une application Angular typique est organisée comme suit :

```
src/
├── app/                 # Code de l'application
│   ├── components/      # Composants réutilisables
│   ├── services/        # Services pour la logique métier et les appels API
│   ├── models/          # Interfaces et classes de données
│   ├── pages/           # Composants représentant des pages complètes
│   └── shared/          # Éléments partagés (pipes, directives...)
├── assets/              # Images, fichiers statiques
└── environments/        # Configuration par environnement
```

## Les concepts fondamentaux d'Angular

### 1. Composants (Components)

Un composant est comme une pièce de votre maison (cuisine, salon) avec sa propre apparence et fonctionnalité. Chaque composant encapsule :
- Un template HTML (l'apparence)
- Une classe TypeScript (le comportement)
- Des styles CSS (l'esthétique)

```typescript
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  user: User;
  
  constructor(private userService: UserService) { }
  
  ngOnInit(): void {
    this.loadUserData();
  }
  
  loadUserData(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }
}
```

### 2. Services

Les services sont comme les utilitaires de votre maison (électricité, eau, internet). Ils fournissent des fonctionnalités partagées entre composants.

Par exemple, un service pour communiquer avec votre API SpringBoot :

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  
  constructor(private http: HttpClient) { }
  
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/current`);
  }
  
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }
}
```

### 3. Routing

Le routing est comme le système de couloirs et de portes qui permet de naviguer entre les pièces de votre maison.

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 4. Modèles (Models)

Les modèles définissent la structure de vos données, comme les plans détaillés des meubles de votre maison.

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}
```

## Migration vers Angular 20

### Étapes de mise en place

1. **Installer Angular CLI** :
   ```bash
   npm install -g @angular/cli
   ```

2. **Créer une nouvelle application** :
   ```bash
   ng new dropin-frontend --routing --style=scss
   ```

3. **Créer la structure de base** :
   ```bash
   cd dropin-frontend
   ng generate module core
   ng generate module shared
   mkdir -p src/app/features
   ```

4. **Migrer les modèles** :
   - Créer des interfaces TypeScript correspondant à vos entités Java
   - Placer ces fichiers dans le dossier models

5. **Créer des services** :
   ```bash
   ng generate service services/api
   ng generate service services/auth
   ```

6. **Créer les composants principaux** :
   ```bash
   ng generate component components/header
   ng generate component components/footer
   ng generate component pages/home
   ng generate component pages/login
   ```

## Architecture recommandée pour votre projet DropIn

Pour votre projet DropIn, je recommande une architecture par fonctionnalités :

```
src/app/
├── core/                # Services singleton, intercepteurs, guards
│   ├── services/        # Services de base (auth, http, etc.)
│   ├── interceptors/    # Intercepteurs HTTP
│   └── guards/          # Guards pour le routing
├── shared/              # Composants, directives, pipes partagés
├── features/            # Modules fonctionnels
│   ├── users/           # Tout ce qui concerne les utilisateurs
│   ├── products/        # Tout ce qui concerne les produits
│   └── orders/          # Tout ce qui concerne les commandes
└── pages/               # Composants de page
```

## Communication avec le Backend SpringBoot

Pour communiquer avec votre API SpringBoot, vous utiliserez le module HttpClient d'Angular :

```typescript
// service d'exemple
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

## Ressources complémentaires

- [Documentation officielle d'Angular](https://angular.io/docs)
- [Angular University](https://angular-university.io/)
- [Tutoriels Angular sur Academind](https://academind.com/tutorials/angular-2-introduction)

