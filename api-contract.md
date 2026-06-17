# API Contract — Backoffice Capstone

Base URL: `/api`

Authentication: **Bearer Token** via `Authorization: Bearer <token>` header

Content-Type: `application/json` for all request/response bodies

---

## Common Error Responses

All endpoints may return the following error responses:

| Status | Condition |
|--------|-----------|
| `401` | Invalid or missing token |
| `403` | User lacks permission |
| `500` | Server error |

**Error Response Body:**

```json
{
  "message": "string"
}
```

---

## 1. Auth — Login

`POST /api/auth/login`

**Auth:** None

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response `200 OK`:**

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Response `401 Unauthorized`:**

```json
{
  "message": "Email atau password tidak cocok dengan data user."
}
```

---

## 2. Auth — Get Current User

`GET /api/auth/me`

**Auth:** Bearer Token

**Response `200 OK`:**

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

**Response `401 Unauthorized`:**

```json
{
  "message": "Sesi login tidak ditemukan."
}
```

---

## 3. Users — List Users

`GET /api/users`

**Auth:** Bearer Token

**Response `200 OK`:**

```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "Admin | Manager | Staff",
    "status": "Active | Pending | Suspended",
    "lastActive": "string"
  }
]
```

---

## 4. Users — Get User by ID

`GET /api/users/{id}`

**Auth:** Bearer Token

**Path Parameter:** `id` (string)

**Response `200 OK`:**

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "Admin | Manager | Staff",
  "status": "Active | Pending | Suspended",
  "lastActive": "string"
}
```

**Response `404 Not Found`:**

```json
{
  "message": "User tidak ditemukan."
}
```

---

## 5. Users — Create User

`POST /api/users`

**Auth:** Bearer Token

**Request Body:**

```json
{
  "name": "string (required, min 1 character)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)",
  "role": "Admin | Manager | Staff (required)",
  "status": "Active | Pending | Suspended (required)"
}
```

**Response `201 Created`:**

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "Admin | Manager | Staff",
  "status": "Active | Pending | Suspended",
  "lastActive": "Never"
}
```

---

## 6. Users — Update User

`PUT /api/users/{id}`

**Auth:** Bearer Token

**Path Parameter:** `id` (string)

**Request Body:**

```json
{
  "name": "string (required, min 1 character)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)",
  "role": "Admin | Manager | Staff (required)",
  "status": "Active | Pending | Suspended (required)"
}
```

**Response `200 OK`:**

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "Admin | Manager | Staff",
  "status": "Active | Pending | Suspended",
  "lastActive": "string"
}
```

**Response `404 Not Found`:**

```json
{
  "message": "User tidak ditemukan."
}
```

---

## 7. Users — Update User Status

`PATCH /api/users/{id}/status`

**Auth:** Bearer Token

**Path Parameter:** `id` (string)

**Request Body:**

```json
{
  "status": "Active | Pending | Suspended"
}
```

**Response `200 OK`:**

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "Admin | Manager | Staff",
  "status": "Active | Pending | Suspended",
  "lastActive": "string"
}
```

**Response `404 Not Found`:**

```json
{
  "message": "User tidak ditemukan."
}
```

---

## 8. Requests — List Requests

`GET /api/requests`

**Auth:** Bearer Token

**Response `200 OK`:**

```json
[
  {
    "id": "string",
    "title": "string",
    "owner": "string",
    "status": "Pending | Approved | Rejected",
    "priority": "Low | Medium | High",
    "assignee": "string",
    "submittedAt": "datetime (ISO 8601)"
  }
]
```

---

## 9. Requests — Get Request by ID

`GET /api/requests/{id}`

**Auth:** Bearer Token

**Path Parameter:** `id` (string)

**Response `200 OK`:**

```json
{
  "id": "string",
  "title": "string",
  "owner": "string",
  "status": "Pending | Approved | Rejected",
  "priority": "Low | Medium | High",
  "assignee": "string",
  "submittedAt": "datetime (ISO 8601)"
}
```

**Response `404 Not Found`:**

```json
{
  "message": "Request tidak ditemukan."
}
```

---

## 10. Requests — Update Request Status

`PATCH /api/requests/{id}/status`

**Auth:** Bearer Token

**Path Parameter:** `id` (string)

**Request Body:**

```json
{
  "status": "Pending | Approved | Rejected"
}
```

**Response `200 OK`:**

```json
{
  "id": "string",
  "title": "string",
  "owner": "string",
  "status": "Pending | Approved | Rejected",
  "priority": "Low | Medium | High",
  "assignee": "string",
  "submittedAt": "datetime (ISO 8601)"
}
```

**Response `404 Not Found`:**

```json
{
  "message": "Request tidak ditemukan."
}
```

---

## 11. Audit Logs — List Audit Logs

`GET /api/audit-logs`

**Auth:** Bearer Token

**Response `200 OK`:**

```json
[
  {
    "id": "string",
    "actor": "string",
    "action": "string",
    "target": "string",
    "createdAt": "datetime (ISO 8601)"
  }
]
```

---

## Data Models (C# / .NET Reference)

### UserRole (Enum)

```csharp
public enum UserRole
{
    Admin,
    Manager,
    Staff
}
```

### UserStatus (Enum)

```csharp
public enum UserStatus
{
    Active,
    Pending,
    Suspended
}
```

### RequestStatus (Enum)

```csharp
public enum RequestStatus
{
    Pending,
    Approved,
    Rejected
}
```

### RequestPriority (Enum)

```csharp
public enum RequestPriority
{
    Low,
    Medium,
    High
}
```

### User (Model)

| Field       | Type         | Notes                      |
|-------------|--------------|----------------------------|
| Id          | string       | Primary key (GUID)         |
| Name        | string       | Required, min 1 char       |
| Email       | string       | Required, valid email       |
| Password    | string       | Required, min 6 chars      |
| Role        | UserRole     | Enum                        |
| Status      | UserStatus   | Enum                        |
| LastActive  | string       | Display string              |

### Request (Model)

| Field        | Type             | Notes                |
|--------------|------------------|----------------------|
| Id           | string           | Primary key           |
| Title        | string           | Required              |
| Owner        | string           | User name             |
| Status       | RequestStatus     | Enum                  |
| Priority     | RequestPriority  | Enum                  |
| Assignee     | string           | User name             |
| SubmittedAt  | DateTime         | ISO 8601 format       |

### AuditLog (Model)

| Field      | Type     | Notes                |
|------------|----------|----------------------|
| Id         | string   | Primary key           |
| Actor      | string   | User name             |
| Action     | string   | Description of action |
| Target     | string   | Target entity          |
| CreatedAt  | DateTime | ISO 8601 format       |

### LoginRequest (DTO)

| Field    | Type   | Notes           |
|----------|--------|-----------------|
| Email    | string | Required        |
| Password | string | Required        |

### LoginResponse (DTO)

| Field | Type         | Notes            |
|-------|--------------|------------------|
| Token | string       | JWT token         |
| User  | CurrentUser  | Current user data |

### CurrentUser (DTO)

| Field | Type     | Notes   |
|-------|----------|---------|
| Id    | string   |         |
| Name  | string   |         |
| Email | string   |         |
| Role  | string   |         |

---

## Endpoints Summary

| #  | Method | Endpoint                        | Auth   | Description            |
|----|--------|---------------------------------|--------|------------------------|
| 1  | POST   | `/api/auth/login`              | None   | Login                  |
| 2  | GET    | `/api/auth/me`                 | Bearer | Get current user       |
| 3  | GET    | `/api/users`                   | Bearer | List all users         |
| 4  | GET    | `/api/users/{id}`              | Bearer | Get user by ID         |
| 5  | POST   | `/api/users`                   | Bearer | Create user            |
| 6  | PUT    | `/api/users/{id}`              | Bearer | Update user            |
| 7  | PATCH  | `/api/users/{id}/status`      | Bearer | Update user status     |
| 8  | GET    | `/api/requests`                | Bearer | List all requests       |
| 9  | GET    | `/api/requests/{id}`           | Bearer | Get request by ID      |
| 10 | PATCH  | `/api/requests/{id}/status`   | Bearer | Update request status  |
| 11 | GET    | `/api/audit-logs`              | Bearer | List all audit logs    |