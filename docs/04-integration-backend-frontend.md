# Intégration du Backend SpringBoot avec le Frontend Angular

## Introduction à l'intégration

Imaginez votre application comme une entreprise où le backend est le département de production et le frontend est le département des ventes. Pour que l'entreprise fonctionne correctement, ces deux départements doivent communiquer efficacement. Cette communication est assurée par les API REST.

## Le contrat API : la clé d'une bonne intégration

Un contrat API bien défini est comme un accord clair entre les départements de production et de ventes sur ce qui sera produit, dans quels délais et selon quelles spécifications.

### Exemple de contrat API pour un endpoint

```
GET /api/users/{id}

Description: Récupère les détails d'un utilisateur par son ID
Paramètres:
  - id (path): identifiant unique de l'utilisateur
Réponses:
  - 200 OK: Utilisateur trouvé
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  - 404 Not Found: Utilisateur non trouvé
    {
      "message": "User with id 1 not found"
    }
```

## Configuration CORS

Le CORS (Cross-Origin Resource Sharing) est comme un système de sécurité à l'entrée de votre entreprise. Il détermine quels "visiteurs" (origines) peuvent accéder à vos ressources.

### Configuration côté SpringBoot

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200") // URL de votre app Angular
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Configuration côté Angular (si nécessaire)

Angular envoie automatiquement les en-têtes CORS appropriés, mais vous pouvez configurer un proxy pour éviter les problèmes CORS en développement :

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Gestion des requêtes HTTP dans Angular

### Service API générique

Créez un service de base pour gérer les interactions HTTP :

```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  get<T>(url: string, options?: any): Observable<T> {
    return this.http.get<T>(url, options).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  // Méthodes put, delete, etc.

  private handleError(error: HttpErrorResponse) {
    // Logique de gestion d'erreur
    return throwError(() => error);
  }
}
```

### Intercepteurs HTTP

Les intercepteurs sont comme des gardiens ou des contrôleurs qui inspectent chaque colis (requête) qui entre ou sort de votre entreprise.

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajouter le token à chaque requête
    if (this.authService.isLoggedIn()) {
      const authToken = this.authService.getToken();
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }
    return next.handle(req);
  }
}
```

## Modèles de données partagés

Pour maintenir la cohérence entre le frontend et le backend, créez des modèles TypeScript qui reflètent vos entités Java.

### Entité Java (Backend)

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    // getters, setters, etc.
}
```

### Interface TypeScript (Frontend)

```typescript
export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}
```

## Gestion des erreurs

Une bonne gestion des erreurs est essentielle pour une intégration robuste.

### Côté Backend

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse();
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setMessage(ex.getMessage());
        error.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    // Autres handlers...
}
```

### Côté Frontend

```typescript
// Dans un service
getProduct(id: number): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
    catchError(error => {
      if (error.status === 404) {
        // Gérer spécifiquement les 404
        this.notificationService.show('Produit non trouvé');
      }
      return throwError(() => error);
    })
  );
}
```

## Déploiement intégré

Pour un déploiement intégré, vous pouvez configurer SpringBoot pour servir l'application Angular.

1. **Construire l'application Angular** :
   ```bash
   ng build --prod
   ```

2. **Copier les fichiers générés** dans le dossier `src/main/resources/static` de votre projet SpringBoot

3. **Configurer le routage côté serveur** :
   ```java
   @Controller
   public class FrontendController {
       @RequestMapping(value = "/{path:[^\\.]*}")
       public String redirect() {
           return "forward:/index.html";
       }
   }
   ```

## Tests d'intégration

Les tests d'intégration sont essentiels pour s'assurer que le backend et le frontend fonctionnent bien ensemble.

### Tests d'API avec Postman ou RestAssured

Créez une collection de tests pour vérifier que chaque endpoint répond correctement :

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerIntegrationTest {
    @LocalServerPort
    private int port;
    
    @Test
    public void testGetUser() {
        given()
            .port(port)
            .when()
            .get("/api/users/1")
            .then()
            .statusCode(200)
            .body("id", equalTo(1))
            .body("username", equalTo("johndoe"));
    }
}
```

### Tests end-to-end avec Cypress

Testez le flux complet de votre application avec Cypress :

```javascript
describe('User Profile', () => {
  it('should load user profile data from API', () => {
    cy.login('johndoe', 'password');
    cy.visit('/profile');
    cy.wait('@getUserProfile'); // Intercepte l'appel API
    cy.contains('John Doe');
    cy.contains('john@example.com');
  });
});
```

## Conclusion et bonnes pratiques

Pour une intégration réussie entre SpringBoot et Angular :

1. **Définissez clairement le contrat API** avant l'implémentation
2. **Utilisez des DTO** pour séparer les modèles internes des données exposées
3. **Versionnez votre API** pour faciliter les évolutions futures
4. **Documentez votre API** avec Swagger/OpenAPI
5. **Implémentez une gestion cohérente des erreurs** des deux côtés
6. **Sécurisez vos communications** avec HTTPS et tokens JWT
7. **Testez l'intégration** régulièrement

Dans les prochains documents, nous explorerons des aspects spécifiques comme l'authentification, la sécurité et les fonctionnalités avancées pour votre projet DropIn.

