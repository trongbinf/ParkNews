# Controllers Summary - ParkNews API

## Overview
All controllers have been created with OData support for search and filter functionality. Each controller inherits from `ODataController` and uses the `[EnableQuery]` attribute for OData operations.

## Controllers Created

### 1. ArticlesController
**Route:** `api/Articles`

**Features:**
- Full CRUD operations (GET, POST, PUT, DELETE)
- OData support with `[EnableQuery]` attribute
- Search functionality: `GET /api/Articles/search?q=keyword`
- Featured articles: `GET /api/Articles/featured`
- Articles by category: `GET /api/Articles/category/{categoryId}`
- Articles by author: `GET /api/Articles/author/{authorId}`
- Automatic slug generation for SEO-friendly URLs
- Includes related entities (Category, Author, Source, Tags)

**OData Query Examples:**
```
GET /api/Articles?$filter=IsFeatured eq true
GET /api/Articles?$orderby=PublishDate desc
GET /api/Articles?$top=10&$skip=20
GET /api/Articles?$select=Id,Title,Summary
GET /api/Articles?$filter=contains(Title,'news')
```

### 2. CategoriesController
**Route:** `api/Categories`

**Features:**
- Full CRUD operations
- OData support with search and filtering
- Search functionality: `GET /api/Categories/search?q=keyword`
- Parent categories: `GET /api/Categories/parents`
- Subcategories: `GET /api/Categories/{id}/subcategories`
- Category articles: `GET /api/Categories/{id}/articles`
- Hierarchical category structure support
- Automatic slug generation

**OData Query Examples:**
```
GET /api/Categories?$filter=ParentCategoryId eq null
GET /api/Categories?$expand=SubCategories
GET /api/Categories?$orderby=Name asc
```

### 3. AuthorsController
**Route:** `api/Authors`

**Features:**
- Full CRUD operations
- OData support with search and filtering
- Search functionality: `GET /api/Authors/search?q=keyword`
- Author articles: `GET /api/Authors/{id}/articles`
- Popular authors: `GET /api/Authors/popular`
- Includes article count for popularity ranking

**OData Query Examples:**
```
GET /api/Authors?$orderby=Articles/$count desc
GET /api/Authors?$filter=contains(FullName,'John')
GET /api/Authors?$top=10
```

### 4. TagsController
**Route:** `api/Tags`

**Features:**
- Full CRUD operations
- OData support with search and filtering
- Search functionality: `GET /api/Tags/search?q=keyword`
- Tag articles: `GET /api/Tags/{id}/articles`
- Popular tags: `GET /api/Tags/popular`
- Automatic slug generation
- Article count for popularity ranking

**OData Query Examples:**
```
GET /api/Tags?$orderby=ArticleTags/$count desc
GET /api/Tags?$filter=contains(Name,'tech')
GET /api/Tags?$top=20
```

### 5. SourcesController
**Route:** `api/Sources`

**Features:**
- Full CRUD operations
- OData support with search and filtering
- Search functionality: `GET /api/Sources/search?q=keyword`
- Source articles: `GET /api/Sources/{id}/articles`
- Popular sources: `GET /api/Sources/popular`
- Article count for popularity ranking

**OData Query Examples:**
```
GET /api/Sources?$orderby=Articles/$count desc
GET /api/Sources?$filter=contains(Name,'Express')
GET /api/Sources?$top=10
```

### 6. CommentsController
**Route:** `api/Comments`

**Features:**
- Full CRUD operations
- OData support with search and filtering
- Search functionality: `GET /api/Comments/search?q=keyword`
- Article comments: `GET /api/Comments/article/{articleId}`
- Approved comments: `GET /api/Comments/approved`
- Pending comments: `GET /api/Comments/pending`
- Comment approval/rejection: `PUT /api/Comments/{id}/approve` or `/reject`
- Automatic timestamp management

**OData Query Examples:**
```
GET /api/Comments?$filter=IsApproved eq true
GET /api/Comments?$orderby=PostedAt desc
GET /api/Comments?$filter=contains(Content,'great')
```

### 7. UsersController
**Route:** `api/Users`

**Features:**
- Full CRUD operations
- OData support with search and filtering
- Search functionality: `GET /api/Users/search?q=keyword`
- Recent users: `GET /api/Users/recent`
- Active users: `GET /api/Users/active`
- Automatic timestamp management (CreatedAt, UpdatedAt)

**OData Query Examples:**
```
GET /api/Users?$orderby=CreatedAt desc
GET /api/Users?$filter=contains(FirstName,'John')
GET /api/Users?$top=20
```

## OData Features Implemented

### Standard OData Operations
- **$filter** - Filter data based on conditions
- **$orderby** - Sort data by specified fields
- **$top** - Limit number of results
- **$skip** - Skip number of results (pagination)
- **$select** - Select specific fields
- **$expand** - Include related entities

### Custom Search Endpoints
Each controller includes a `/search` endpoint that accepts a `q` parameter for keyword searching:
```
GET /api/Articles/search?q=technology
GET /api/Categories/search?q=sports
GET /api/Authors/search?q=John
```

### Specialized Endpoints
- **Featured/Highlighted content**: `/featured`, `/popular`, `/approved`
- **Hierarchical data**: `/parents`, `/subcategories`
- **Related content**: `/{id}/articles`, `/{id}/comments`
- **Status-based filtering**: `/pending`, `/approved`

## Usage Examples

### Basic OData Queries
```http
GET /api/Articles?$filter=IsFeatured eq true&$orderby=PublishDate desc&$top=5
GET /api/Categories?$expand=SubCategories&$filter=ParentCategoryId eq null
GET /api/Authors?$orderby=Articles/$count desc&$top=10
```

### Search with OData
```http
GET /api/Articles/search?q=technology&$orderby=PublishDate desc&$top=10
GET /api/Tags/search?q=sports&$orderby=ArticleTags/$count desc
```

### Pagination
```http
GET /api/Articles?$skip=20&$top=10
GET /api/Comments?$skip=0&$top=50&$orderby=PostedAt desc
```

## Dependencies
- **AutoMapper**: For DTO mapping
- **Entity Framework Core**: For data access
- **Microsoft.AspNetCore.OData**: For OData support
- **ApplicationDbContext**: Database context

## Notes
- All controllers include proper error handling
- Vietnamese character support in slug generation
- Automatic timestamp management where applicable
- Related entity inclusion for comprehensive data retrieval
- RESTful API design principles followed 