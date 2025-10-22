# Bonnes Pratiques et Sécurité pour votre Application SpringBoot et Angular

## Introduction à la sécurité applicative

Si votre application était une maison, la sécurité serait l'ensemble des serrures, alarmes et systèmes de surveillance qui la protègent. Dans le monde numérique, la sécurité est d'autant plus importante que les menaces sont nombreuses et évoluent constamment.

## Authentification et autorisation

### Comprendre la différence

- **L'authentification** vérifie qui vous êtes, comme un agent de sécurité qui contrôle votre carte d'identité à l'entrée d'un bâtiment.
- **L'autorisation** détermine ce que vous avez le droit de faire, comme les badges d'accès qui limitent les zones auxquelles vous pouvez accéder dans ce bâtiment.

### Mise en œuvre avec Spring Security

Spring Security est comme une entreprise de sécurité complète pour votre application :

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // À activer en production avec une configuration adaptée
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
    
    // Autres configurations...
}
```

### Sécurité avec JWT (JSON Web Tokens)

Les JWT sont comme des badges d'accès temporaires auto-vérifiables :

#### Backend (SpringBoot)

```java
@Service
public class JwtTokenProvider {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;
    
    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Log et gérer les différents types d'exceptions
            return false;
        }
    }
}
```

#### Frontend (Angular)

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Vérifier si le token n'est pas expiré
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  }
}
```

## Protection contre les vulnérabilités courantes

### 1. Injection SQL

Comme laisser un employé mal intentionné accéder à vos archives confidentielles :

**Mauvaise pratique :**
```java
// ⚠️ Vulnérable à l'injection SQL
String query = "SELECT * FROM users WHERE username = '" + username + "'";
```

**Bonne pratique :**
```java
// ✅ Utilisation de requêtes paramétrées via JPA
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
```

### 2. Cross-Site Scripting (XSS)

Comme permettre à quelqu'un d'afficher ses propres panneaux dans votre magasin :

**Bonne pratique côté Angular :**
Angular sanitize automatiquement les entrées, mais vous pouvez aussi :

```html
<div [innerText]="commentaire"></div>  <!-- Plutôt que [innerHTML] -->
```

**Bonne pratique côté SpringBoot :**
```java
public String sanitizeInput(String input) {
    return Jsoup.clean(input, Safelist.basic());
}
```

### 3. Cross-Site Request Forgery (CSRF)

Comme quelqu'un qui vous fait signer un document sans que vous sachiez ce qu'il contient :

**Protection côté Angular :**
```typescript
// Dans app.module.ts
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpXsrfInterceptor,
      multi: true
    }
  ]
})
```

**Protection côté SpringBoot :**
```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            // autres configurations
    }
}
```

## Bonnes pratiques générales

### 1. Validation des entrées

Validez toutes les entrées utilisateur comme un agent de sécurité qui vérifie minutieusement chaque visiteur :

**Côté Backend :**
```java
@PostMapping("/register")
public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest,
                                      BindingResult result) {
    if (result.hasErrors()) {
        // Retourner les erreurs de validation
    }
    // Traitement normal...
}

// Dans la classe SignUpRequest
public class SignUpRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;
    
    @NotBlank
    @Size(max = 100)
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    
    // getters, setters...
}
```

**Côté Frontend :**
```typescript
// Dans un composant de formulaire
this.registerForm = this.formBuilder.group({
  username: ['', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]],
  email: ['', [
    Validators.required,
    Validators.email,
    Validators.maxLength(100)
  ]],
  password: ['', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(40)
  ]]
});
```

### 2. Logging et monitoring

Comme les caméras de surveillance et les journaux d'accès de votre bâtiment :

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    public void registerUser(User user) {
        logger.info("Tentative d'inscription pour l'utilisateur: {}", user.getUsername());
        try {
            // Logique d'inscription
            logger.info("Utilisateur inscrit avec succès: {}", user.getUsername());
        } catch (Exception e) {
            logger.error("Échec de l'inscription pour l'utilisateur: {}", user.getUsername(), e);
            throw e;
        }
    }
}
```

### 3. Gestion des exceptions

Comme un plan d'évacuation bien défini en cas d'urgence :

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        logger.error("Exception non gérée", ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Une erreur inattendue s'est produite",
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    // Autres handlers spécifiques...
}
```

### 4. Rate Limiting

Comme limiter le nombre de personnes qui peuvent entrer dans votre bâtiment en même temps :

```java
@Configuration
public class RateLimitingConfig {
    
    @Bean
    public FilterRegistrationBean<RateLimitingFilter> rateLimitingFilter() {
        FilterRegistrationBean<RateLimitingFilter> registrationBean = new FilterRegistrationBean<>();
        
        registrationBean.setFilter(new RateLimitingFilter(100, 60)); // 100 requêtes par minute
        registrationBean.addUrlPatterns("/api/*");
        
        return registrationBean;
    }
}
```

## Liste de contrôle de sécurité pour votre projet DropIn

- [ ] Utiliser HTTPS uniquement
- [ ] Implémenter l'authentification JWT
- [ ] Configurer les CORS correctement
- [ ] Activer la protection CSRF
- [ ] Valider toutes les entrées utilisateur
- [ ] Mettre en œuvre un système de logging complet
- [ ] Gérer correctement les exceptions
- [ ] Mettre en place le rate limiting
- [ ] Ne pas exposer d'informations sensibles dans les logs ou les réponses d'erreur
- [ ] Stocker les mots de passe avec un hachage sécurisé (Bcrypt)
- [ ] Implémenter une politique de mots de passe forts
- [ ] Configurer des headers de sécurité (Content-Security-Policy, etc.)
- [ ] Mettre en place une stratégie de gestion des tokens (expiration, renouvellement)
- [ ] Effectuer des audits de sécurité réguliers

## Ressources complémentaires

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Documentation de Spring Security](https://docs.spring.io/spring-security/reference/index.html)
- [Guide Angular sur la sécurité](https://angular.io/guide/security)
- [JWT.io](https://jwt.io/) - Pour comprendre et déboguer les JWT

