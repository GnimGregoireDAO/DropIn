# Mise en place du Backend avec SpringBoot

## Qu'est-ce que SpringBoot ?

SpringBoot est comme un kit de construction préfabriqué pour maisons : il vous fournit toutes les fondations et structures essentielles pour construire rapidement une application Java robuste, sans avoir à commencer par mélanger vous-même le ciment.

## Structure d'un projet SpringBoot

Votre projet SpringBoot devrait suivre une structure en couches semblable à celle-ci :

```
src/main/java/com/dropin/
├── config/              # Configuration de l'application
├── controller/          # Points d'entrée API REST
├── service/             # Logique métier
├── repository/          # Accès aux données
├── model/               # Entités et DTOs
├── exception/           # Gestion personnalisée des erreurs
└── Application.java     # Point d'entrée de l'application
```

## Les couches expliquées

### 1. Couche Modèle (Model Layer)

C'est comme le plan ou le schéma de vos données. Par exemple, si vous avez un objet "Utilisateur" :

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    // getters, setters, etc.
}
```

### 2. Couche Repository (Repository Layer)

C'est comme un bibliothécaire qui connaît exactement où trouver chaque livre (donnée) et comment le ranger. Vous n'avez qu'à lui demander ce que vous voulez :

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByEmailContaining(String emailPart);
}
```

### 3. Couche Service (Service Layer)

C'est comme le chef cuisinier qui prend les ingrédients (données brutes) et les transforme en plats délicieux (fonctionnalités métier) :

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User registerUser(User user) {
        // Vérifications, logique métier, etc.
        return userRepository.save(user);
    }
}
```

### 4. Couche Contrôleur (Controller Layer)

C'est comme le serveur du restaurant qui prend les commandes des clients (requêtes HTTP) et les transmet à la cuisine (services) :

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        // Implémentation
    }
}
```

## Configuration de base de SpringBoot

### Le fichier pom.xml

Votre fichier pom.xml est comme la liste d'ingrédients pour votre application :

```xml
<dependencies>
    <!-- Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Base de données -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Autres dépendances... -->
</dependencies>
```

### Le fichier application.properties

Ce fichier contient vos paramètres de configuration, comme les réglages d'un appareil :

```properties
# Configuration de la base de données
spring.datasource.url=jdbc:h2:mem:dropindb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Configuration JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Configuration du serveur
server.port=8080
```

## Étapes pour migrer vers SpringBoot

1. **Créer un nouveau projet SpringBoot** :
   - Utiliser Spring Initializr (https://start.spring.io/)
   - Sélectionner les dépendances nécessaires (Web, JPA, etc.)

2. **Migrer vos modèles** :
   - Convertir vos classes de données en entités JPA
   - Ajouter les annotations nécessaires (@Entity, @Id, etc.)

3. **Créer les repositories** :
   - Définir les interfaces étendant JpaRepository
   - Ajouter les méthodes de requête personnalisées

4. **Migrer la logique métier** :
   - Créer des services pour encapsuler votre logique
   - Injecter les repositories nécessaires

5. **Créer les contrôleurs REST** :
   - Définir les endpoints API
   - Implémenter les opérations CRUD

6. **Configurer la sécurité** (si nécessaire) :
   - Ajouter Spring Security
   - Configurer l'authentification et l'autorisation

## Exemple pratique pour votre projet DropIn

Dans les prochains documents, nous appliquerons ces concepts à votre projet spécifique en créant une structure adaptée à vos besoins.

## Ressources complémentaires

- [Documentation officielle SpringBoot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Guides Spring](https://spring.io/guides)
- [Baeldung - Tutoriels Spring](https://www.baeldung.com/spring-tutorial)

