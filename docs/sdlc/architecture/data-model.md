# Data Model

<!-- sdlc:auto:start entities -->
### note

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | string (uuid) | True | — | False |
| title | string | False | — | True |
| body | text (plain-text) | False | — | True |
| created_at | timestamp (ISO string) | False | — | False |
| updated_at | timestamp (ISO string) | False | — | False |
<!-- sdlc:auto:end entities -->

<!-- sdlc:auto:start relationships -->
_No relationships recorded._
<!-- sdlc:auto:end relationships -->

<!-- sdlc:auto:start er-diagram -->
```mermaid
erDiagram
  note {
    string__uuid_ id PK
    string title
    text__plain_text_ body
    timestamp__ISO_string_ created_at
    timestamp__ISO_string_ updated_at
  }
```
<!-- sdlc:auto:end er-diagram -->
