# Tutorial Demo Integrasi Real API

Dokumen ini berisi bahan demo untuk menjelaskan perubahan dari mock JSON/MSW ke real API, termasuk letak file, flow request-response, mapping response API, dan poin yang perlu dipahami saat presentasi.

## 1. Tujuan Perubahan

Sebelumnya aplikasi bisa memakai data mock dari MSW. Sekarang aplikasi bisa diarahkan ke real backend melalui konfigurasi environment.

Inti perubahannya:

- Mock API bisa dimatikan lewat `VITE_USE_MSW=false`.
- Base URL real API diambil dari `VITE_API_BASE_URL`.
- Semua request API lewat helper di `src/api/client.ts`.
- Response API dimapping dulu sebelum dipakai komponen UI.

## 2. File Penting

| File | Fungsi |
| --- | --- |
| `.env` | Mengatur apakah app pakai MSW atau real API. |
| `src/main.tsx` | Menentukan apakah MSW dijalankan saat development. |
| `src/api/client.ts` | API client utama untuk fetch, header, token, error, dan response envelope. |
| `src/api/auth.ts` | API login dan current user. |
| `src/api/users.ts` | API list, detail, create, update, dan update status user. |
| `src/api/requests.ts` | API list, detail, create, update, dan delete request. |
| `src/api/audit-logs.ts` | API list audit logs. |
| `src/app/requests/detail/page.tsx` | Contoh halaman yang memakai data dari real API melalui React Query. |

## 3. Konfigurasi Real API

File: `.env`

```env
VITE_USE_MSW=false
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Penjelasan:

- `VITE_USE_MSW=false` berarti mock service worker tidak dijalankan.
- `VITE_API_BASE_URL` adalah alamat backend.
- Jika halaman memanggil path `/requests`, URL akhirnya menjadi `http://localhost:8000/api/v1/requests`.

## 4. Kapan Mock API Aktif?

File: `src/main.tsx`

```tsx
async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MSW === "false") {
    return
  }

  const { worker } = await import("./mocks/browser")

  return worker.start({
    onUnhandledRequest: "bypass",
  })
}
```

Artinya:

- MSW hanya bisa aktif saat development.
- Jika `VITE_USE_MSW=false`, MSW tidak aktif.
- Jika MSW tidak aktif, request akan benar-benar dikirim ke backend.

## 5. API Client Utama

File: `src/api/client.ts`

Fungsi utama:

- `apiRequest`
- `apiDataRequest`
- `apiItemsRequest`

### 5.1 `apiRequest`

`apiRequest` adalah helper fetch paling dasar.

Yang dilakukan:

- Membuat URL API dari `VITE_API_BASE_URL`.
- Mengambil token dari `localStorage`.
- Menambahkan header `Accept: application/json`.
- Menambahkan `Content-Type: application/json` jika request punya body.
- Menambahkan `Authorization: Bearer <token>` jika token tersedia.
- Mengubah body object menjadi JSON string.
- Mengecek error response.
- Parse response JSON.

Contoh alur:

```tsx
const response = await fetch(url, {
  ...requestOptions,
  headers: requestHeaders,
  body: body === undefined ? undefined : JSON.stringify(body),
})
```

Jika response error, helper ini membuat `ApiError`.

```tsx
throw new ApiError(
  getErrorMessage(errorPayload),
  response.status,
)
```

Jika status `401`, user akan logout otomatis dan diarahkan ke `/login`.

### 5.2 `apiDataRequest`

`apiDataRequest` dipakai untuk response yang bisa berbentuk envelope.

Backend biasanya mengirim response seperti ini:

```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "id": "REQ-001",
    "title": "Access Request"
  }
}
```

`apiDataRequest` mengambil isi `data`, sehingga feature module tidak perlu membuka envelope berulang-ulang.

Jika backend mengirim data langsung tanpa envelope, helper ini tetap mengembalikan payload tersebut.

### 5.3 `apiItemsRequest`

`apiItemsRequest` dipakai untuk list data.

Helper ini mendukung dua bentuk response:

```json
[
  {
    "id": "REQ-001"
  }
]
```

atau:

```json
{
  "status_code": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "REQ-001"
      }
    ]
  }
}
```

Hasil akhirnya selalu array, supaya table di UI lebih mudah memakai data.

## 6. Flow Umum Request dan Response

Flow dari UI sampai data tampil:

1. User membuka halaman.
2. Component memanggil custom hook.
3. Custom hook memakai React Query.
4. React Query memanggil function di `src/api/...`.
5. Function API memanggil `apiRequest`, `apiDataRequest`, atau `apiItemsRequest`.
6. `apiRequest` mengirim fetch ke real backend.
7. Backend mengirim JSON response.
8. Helper API membuka envelope response.
9. Feature module mapping field API ke format UI.
10. React Query menyimpan data di cache.
11. Component menampilkan loading, error, atau data sukses.

## 7. Flow Detail Request

Contoh flow di halaman request detail.

### 7.1 Route

File: `src/app/App.tsx`

```tsx
<Route path="/requests/:id" element={<RequestDetailPage />} />
```

URL seperti `/requests/REQ-001` akan membuka halaman detail request.

### 7.2 Ambil ID dari URL

File: `src/app/requests/detail/page.tsx`

```tsx
const params = useParams()
const requestQuery = useRequestQuery(params.id)
```

`useParams()` mengambil `id` dari URL.

### 7.3 Fetch Data Detail

File: `src/app/requests/detail/_hooks/use-request-query.ts`

```tsx
export function useRequestQuery(id: string | undefined) {
  return useQuery({
    queryKey: requestsQueryKeys.detail(id ?? ""),
    queryFn: () => getRequest(id ?? ""),
    enabled: Boolean(id),
  })
}
```

Penjelasan:

- `queryKey` membedakan cache per ID request.
- `queryFn` memanggil API detail request.
- `enabled: Boolean(id)` mencegah fetch jika ID belum tersedia.

### 7.4 Panggil Endpoint Backend

File: `src/api/requests.ts`

```tsx
export async function getRequest(id: string) {
  const data = await apiDataRequest<ApiRequest | { items?: ApiRequest[] }>(
    `/requests/${id}`,
  )

  return mapRequest(getApiRequestFromData(data, id))
}
```

Jika `id = REQ-001`, request dikirim ke:

```txt
http://localhost:8000/api/v1/requests/REQ-001
```

### 7.5 Mapping Response Detail

File: `src/api/requests.ts`

```tsx
function mapRequest(request: ApiRequest): MockRequest {
  return {
    id: request.id,
    title: request.title ?? request.name ?? "Untitled request",
    owner: request.requestor_name ?? request.owner ?? "Unknown",
    status: mapRequestStatusToUi(request.status),
    priority: mapPriorityToUi(request.priority),
    assignee: request.assignee_name ?? request.assignee ?? "Unassigned",
    submittedAt: request.submitted_at
      ?? request.created_at
      ?? request.updated_at
      ?? new Date(0).toISOString(),
  }
}
```

Mapping ini membuat UI tidak bergantung langsung pada nama field backend.

Contoh mapping:

| Field API | Field UI |
| --- | --- |
| `requestor_name` | `owner` |
| `assignee_name` | `assignee` |
| `submitted_at`, `created_at`, `updated_at` | `submittedAt` |
| `active` | `Active` |
| `high` | `High` |

## 8. Flow Users API

File: `src/api/users.ts`

### 8.1 List Users

```tsx
export async function getUsers() {
  const users = await apiItemsRequest<ApiUser>("/users")

  return users.map(mapUser)
}
```

Flow:

1. UI memanggil hook users.
2. Hook memanggil `getUsers`.
3. `getUsers` memanggil `/users`.
4. `apiItemsRequest` memastikan hasilnya array.
5. Setiap item dimapping lewat `mapUser`.

### 8.2 Detail User

```tsx
export async function getUser(id: string) {
  const data = await apiDataRequest<ApiUser | { items?: ApiUser[] }>(
    `/users/${id}`,
  )

  return mapUser(getApiUserFromData(data, id))
}
```

Flow detail user mirip dengan detail request.

### 8.3 Create dan Update User

```tsx
function mapUserPayload(values: UserFormValues) {
  return {
    name: values.name,
    email: values.email,
    password: values.password,
    role: mapUserRoleToApi(values.role),
    status: mapUserStatusToApi(values.status),
  }
}
```

Saat create atau update, data dari form dimapping dulu ke format backend.

Contoh:

| Field UI | Field API |
| --- | --- |
| `Admin` | `admin` |
| `Manager` | `manager` |
| `Staff` | `viewer` |
| `Active` | `active` |
| `Pending` | `pending` |
| `Suspended` | `suspended` |

## 9. Flow Auth API

File: `src/api/auth.ts`

### 9.1 Login

```tsx
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const data = await apiDataRequest<ApiLoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
    redirectOnUnauthorized: false,
  })

  return {
    token: data.access_token,
    user: mapCurrentUser(data),
  }
}
```

Flow:

1. User submit email dan password.
2. Frontend memanggil `/auth/login`.
3. Backend mengirim `access_token`.
4. Frontend mengubah `access_token` menjadi `token`.
5. Token disimpan oleh flow login.
6. Request berikutnya memakai header `Authorization`.

### 9.2 Current User

```tsx
export async function getCurrentUser() {
  const data = await apiDataRequest<ApiUser>("/auth/me", {
    scenarioParam: "authScenario",
  })

  return mapCurrentUser(data)
}
```

Endpoint ini dipakai untuk membaca user yang sedang login.

## 10. Flow Error Response

File: `src/api/client.ts`

Jika backend mengirim error:

```json
{
  "message": "Request tidak ditemukan."
}
```

`apiRequest` akan:

1. Mengecek `response.ok`.
2. Parse body error.
3. Ambil pesan dari `message`, `error`, atau `errors`.
4. Throw `ApiError`.
5. React Query mengubah state menjadi `isError`.
6. UI menampilkan error state.

Contoh di halaman request detail:

```tsx
if (requestQuery.isError) {
  return (
    <ApiErrorState
      error={requestQuery.error}
      fallbackMessage="Request detail gagal dimuat."
      onRetry={() => void requestQuery.refetch()}
    />
  )
}
```

## 11. Loading, Error, dan Success State

Halaman detail request punya 3 state utama.

### Loading

```tsx
if (requestQuery.isLoading) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
```

Saat data belum selesai diambil, UI menampilkan skeleton.

### Error

```tsx
if (requestQuery.isError) {
  return <ApiErrorState ... />
}
```

Saat request gagal, UI menampilkan pesan error dan tombol retry.

### Success

```tsx
const request = requestQuery.data
```

Saat data berhasil didapat, UI menampilkan detail request.

## 12. Query Cache dan Refresh

React Query dipakai untuk mengatur cache dan state async.

Contoh query key:

```tsx
detail: (id: string) => [...requestsQueryKeys.details(), id] as const
```

Manfaat:

- Detail request punya cache sendiri per ID.
- List request dan detail request tidak saling tercampur.
- Data bisa direfresh dengan `refetch`.
- UI bisa tahu apakah data sedang fetching atau stale.

## 13. Skenario Demo yang Disarankan

Gunakan urutan ini saat demo:

1. Tunjukkan `.env`.
   Jelaskan `VITE_USE_MSW=false` dan `VITE_API_BASE_URL`.

2. Tunjukkan `src/main.tsx`.
   Jelaskan bahwa MSW tidak dijalankan jika `VITE_USE_MSW=false`.

3. Tunjukkan `src/api/client.ts`.
   Jelaskan ini pusat komunikasi ke backend.

4. Tunjukkan `apiRequest`.
   Jelaskan URL, headers, token, body JSON, error handling, dan parse JSON.

5. Tunjukkan `apiDataRequest`.
   Jelaskan response envelope `data`.

6. Tunjukkan `apiItemsRequest`.
   Jelaskan list response menjadi array.

7. Tunjukkan `src/api/requests.ts`.
   Jelaskan `getRequests`, `getRequest`, dan `mapRequest`.

8. Tunjukkan `src/app/requests/detail/page.tsx`.
   Jelaskan halaman memakai hook, bukan fetch langsung.

9. Buka app dan klik request detail.
   Jelaskan flow dari route `/requests/:id` sampai data tampil.

10. Simulasikan error jika backend mengembalikan error.
    Jelaskan React Query masuk ke `isError` dan UI menampilkan `ApiErrorState`.

## 14. Step Demo Praktis

Bagian ini bisa kamu pakai sebagai urutan demo dari awal sampai akhir.

### Step 1: Buka Konfigurasi Environment

Buka file `.env`.

Tunjukkan:

```env
VITE_USE_MSW=false
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Yang dijelaskan:

- `VITE_USE_MSW=false` mematikan mock API.
- `VITE_API_BASE_URL` mengarah ke backend asli.
- Semua endpoint akan memakai base URL ini.

Kalimat demo:

> Pertama, saya tunjukkan konfigurasi API. Di sini MSW dimatikan, jadi aplikasi tidak lagi memakai mock data. Base URL diarahkan ke backend asli di `localhost:8000/api/v1`.

### Step 2: Tunjukkan MSW Tidak Aktif

Buka file `src/main.tsx`.

Tunjukkan bagian:

```tsx
if (!import.meta.env.DEV || import.meta.env.VITE_USE_MSW === "false") {
  return
}
```

Yang dijelaskan:

- Saat `VITE_USE_MSW=false`, function `enableMocking` berhenti.
- Worker mock tidak dijalankan.
- Request akan diteruskan ke real backend.

Kalimat demo:

> Di entry point aplikasi, ada pengecekan environment. Kalau `VITE_USE_MSW` bernilai `false`, mock worker tidak dijalankan. Jadi fetch dari frontend akan langsung menuju real API.

### Step 3: Tunjukkan API Client

Buka file `src/api/client.ts`.

Tunjukkan function:

```tsx
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
```

Yang dijelaskan:

- Ini helper fetch utama.
- Semua request backend lewat sini.
- Helper ini membuat URL, memasang header, memasang token, mengirim body, dan menangani error.

Kalimat demo:

> Semua komunikasi ke backend dipusatkan di `apiRequest`. Tujuannya supaya logic fetch, token, header, dan error handling tidak ditulis berulang di setiap halaman.

### Step 4: Jelaskan Pembuatan URL API

Masih di `src/api/client.ts`.

Tunjukkan function:

```tsx
function createApiUrl(path: string, scenarioParam: string | false) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

Yang dijelaskan:

- Path seperti `/users` atau `/requests` digabung dengan `VITE_API_BASE_URL`.
- Contoh: `/requests` menjadi `http://localhost:8000/api/v1/requests`.

Kalimat demo:

> Function ini membentuk URL final. Jadi feature cukup mengirim path seperti `/requests`, lalu API client mengubahnya menjadi URL lengkap berdasarkan environment.

### Step 5: Jelaskan Header dan Token

Masih di `src/api/client.ts`.

Tunjukkan bagian:

```tsx
requestHeaders.set("Accept", "application/json")

if (body !== undefined) {
  requestHeaders.set("Content-Type", "application/json")
}

if (token) {
  requestHeaders.set("Authorization", `Bearer ${token}`)
}
```

Yang dijelaskan:

- `Accept` memberi tahu backend bahwa frontend menerima JSON.
- `Content-Type` dipakai saat mengirim body JSON.
- `Authorization` dikirim jika user sudah login.

Kalimat demo:

> Setelah URL dibuat, helper ini memasang header. Kalau ada token login, token dikirim sebagai bearer token. Jadi endpoint protected tetap bisa diakses setelah login.

### Step 6: Jelaskan Response Envelope

Masih di `src/api/client.ts`.

Tunjukkan function:

```tsx
export async function apiDataRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const payload = await apiRequest<ApiEnvelope<T> | T>(path, options)

  if (isApiEnvelope<T>(payload)) {
    return payload.data as T
  }

  return payload
}
```

Yang dijelaskan:

- Backend bisa mengirim response dengan format `{ status_code, message, data }`.
- UI hanya butuh isi `data`.
- Helper ini mengambil `payload.data`.

Kalimat demo:

> Backend mengirim response dalam bentuk envelope. Karena UI hanya butuh isi datanya, `apiDataRequest` membuka envelope dan mengembalikan bagian `data`.

### Step 7: Jelaskan Response List

Masih di `src/api/client.ts`.

Tunjukkan function:

```tsx
export async function apiItemsRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T[]> {
```

Yang dijelaskan:

- List bisa datang sebagai array langsung.
- List juga bisa datang sebagai `{ items: [...] }`.
- Helper ini memastikan hasil akhirnya selalu array.

Kalimat demo:

> Untuk data list, helper `apiItemsRequest` membuat output selalu array. Dengan begitu table users, requests, dan audit logs bisa langsung memakai data tanpa cek bentuk response lagi.

### Step 8: Tunjukkan Users API

Buka file `src/api/users.ts`.

Tunjukkan:

```tsx
export async function getUsers() {
  const users = await apiItemsRequest<ApiUser>("/users")

  return users.map(mapUser)
}
```

Yang dijelaskan:

- `getUsers` memanggil endpoint `/users`.
- Response list dibaca oleh `apiItemsRequest`.
- Setiap item dimapping ke format UI.

Kalimat demo:

> Di users API, feature tidak fetch langsung. Function ini cukup memanggil `/users`, lalu response dari backend dimapping ke bentuk yang dipakai halaman users.

### Step 9: Jelaskan Mapping User

Masih di `src/api/users.ts`.

Tunjukkan:

```tsx
function mapUser(user: ApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password ?? "",
    role: mapUserRoleToUi(user.role),
    status: mapUserStatusToUi(user.status),
    lastActive: formatLastActive(user.updated_at ?? user.created_at),
  }
}
```

Yang dijelaskan:

- Field API tidak langsung dipakai oleh UI.
- Role dan status diubah ke format display.
- Tanggal backend diubah menjadi `lastActive`.

Kalimat demo:

> Mapping ini menjadi jembatan antara backend dan UI. Misalnya backend mengirim status lowercase, tapi UI memakai label seperti `Active`, `Pending`, dan `Suspended`.

### Step 10: Tunjukkan Requests API

Buka file `src/api/requests.ts`.

Tunjukkan:

```tsx
export async function getRequest(id: string) {
  const data = await apiDataRequest<ApiRequest | { items?: ApiRequest[] }>(
    `/requests/${id}`,
  )

  return mapRequest(getApiRequestFromData(data, id))
}
```

Yang dijelaskan:

- Detail request memakai endpoint `/requests/{id}`.
- Response dibuka oleh `apiDataRequest`.
- Data dimapping oleh `mapRequest`.

Kalimat demo:

> Untuk detail request, ID dari URL dipakai untuk membentuk endpoint. Setelah response masuk, data backend tetap dimapping sebelum masuk ke halaman detail.

### Step 11: Jelaskan Mapping Request

Masih di `src/api/requests.ts`.

Tunjukkan:

```tsx
owner: request.requestor_name ?? request.owner ?? "Unknown",
assignee: request.assignee_name ?? request.assignee ?? "Unassigned",
submittedAt: request.submitted_at
  ?? request.created_at
  ?? request.updated_at
  ?? new Date(0).toISOString(),
```

Yang dijelaskan:

- `requestor_name` dari API menjadi `owner` di UI.
- `assignee_name` dari API menjadi `assignee` di UI.
- Tanggal bisa berasal dari beberapa field fallback.

Kalimat demo:

> Di sini terlihat kenapa mapping penting. Nama field dari backend bisa berbeda dari kebutuhan UI. Dengan mapping, halaman tidak perlu tahu detail nama field backend.

### Step 12: Tunjukkan Halaman Detail Request

Buka file `src/app/requests/detail/page.tsx`.

Tunjukkan:

```tsx
const params = useParams()
const requestQuery = useRequestQuery(params.id)
const request = requestQuery.data
```

Yang dijelaskan:

- Halaman mengambil ID dari URL.
- ID dikirim ke hook query.
- Data hasil query dipakai untuk render halaman.

Kalimat demo:

> Di halaman detail, component tidak memanggil fetch langsung. Component hanya mengambil ID dari URL, lalu memakai custom hook untuk mendapatkan data.

### Step 13: Jelaskan Loading State

Masih di `src/app/requests/detail/page.tsx`.

Tunjukkan:

```tsx
if (requestQuery.isLoading) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
```

Yang dijelaskan:

- Saat request belum selesai, UI menampilkan skeleton.
- State ini berasal dari React Query.

Kalimat demo:

> React Query memberi state `isLoading`. Saat data belum datang, halaman menampilkan skeleton agar user tahu data sedang dimuat.

### Step 14: Jelaskan Error State

Masih di `src/app/requests/detail/page.tsx`.

Tunjukkan:

```tsx
if (requestQuery.isError) {
  return (
    <ApiErrorState
      error={requestQuery.error}
      fallbackMessage="Request detail gagal dimuat."
      onRetry={() => void requestQuery.refetch()}
    />
  )
}
```

Yang dijelaskan:

- Jika backend mengirim error, `apiRequest` throw `ApiError`.
- React Query mengubah state menjadi `isError`.
- UI menampilkan `ApiErrorState`.
- Tombol retry memanggil `refetch`.

Kalimat demo:

> Kalau API gagal, error dari API client diteruskan ke React Query. Halaman membaca `isError`, lalu menampilkan error state dan menyediakan retry.

### Step 15: Jelaskan Success State

Masih di `src/app/requests/detail/page.tsx`.

Tunjukkan bagian render data:

```tsx
{request.title}
Owner: {request.owner}
Assignee: {request.assignee}
Submitted: {formatRequestDate(request.submittedAt)}
```

Yang dijelaskan:

- Data yang tampil sudah hasil mapping.
- Halaman tidak perlu tahu apakah backend mengirim `requestor_name` atau `owner`.

Kalimat demo:

> Saat data berhasil diambil, halaman menampilkan data yang sudah bersih. Field yang dipakai UI sudah konsisten, seperti `owner`, `assignee`, dan `submittedAt`.

### Step 16: Jalankan Demo di Browser

Urutan di browser:

1. Jalankan frontend.
2. Pastikan backend berjalan di `http://localhost:8000/api/v1`.
3. Login.
4. Buka halaman `/requests`.
5. Klik ID request atau tombol `View`.
6. Tunjukkan halaman detail request.
7. Buka DevTools Network.
8. Tunjukkan request ke endpoint real API.
9. Tunjukkan response JSON dari backend.
10. Bandingkan field response dengan field yang tampil di UI.

Kalimat demo:

> Sekarang saya tunjukkan hasilnya di browser. Saat membuka detail request, frontend mengirim request ke backend asli. Response dari backend masuk ke API layer, dimapping, lalu ditampilkan di halaman.

### Step 17: Tunjukkan Network Tab

Di DevTools, buka tab Network.

Cari request seperti:

```txt
GET /api/v1/requests/{id}
GET /api/v1/users
POST /api/v1/auth/login
```

Yang dijelaskan:

- Request tidak berasal dari mock.
- URL mengarah ke backend.
- Header `Authorization` terkirim setelah login.
- Response berbentuk JSON.

Kalimat demo:

> Di Network tab, kita bisa validasi bahwa request benar-benar dikirim ke real API. Setelah login, request protected juga membawa bearer token.

### Step 18: Tutup dengan Ringkasan

Gunakan ringkasan ini:

> Jadi flow lengkapnya adalah component memanggil hook, hook memakai React Query, React Query memanggil function API, function API memakai API client, API client mengirim fetch ke backend, response dibuka dari envelope, lalu data dimapping ke format UI. Dengan pola ini, UI tetap sederhana dan perubahan kontrak backend cukup ditangani di API layer.

## 15. Script Demo Singkat

Gunakan script ini jika perlu menjelaskan cepat:

> Perubahan utama ada di API layer. Sekarang aplikasi tidak mengambil data langsung dari mock JSON, tapi semua komunikasi backend lewat `src/api/client.ts`. Di `.env`, `VITE_USE_MSW=false` mematikan mock service worker, lalu `VITE_API_BASE_URL` menentukan alamat real backend.
>
> Saat halaman membutuhkan data, component memanggil custom hook. Hook memakai React Query untuk memanggil function API seperti `getRequest` atau `getUsers`. Function API memanggil helper seperti `apiDataRequest` atau `apiItemsRequest`. Helper ini memakai `fetch`, memasang header JSON dan token bearer, lalu membaca response dari backend.
>
> Response backend bisa berbentuk envelope seperti `{ status_code, message, data }`. Karena itu `apiDataRequest` mengambil isi `data`. Untuk list, `apiItemsRequest` memastikan hasil akhirnya array. Setelah itu data dari API dimapping ke format UI, misalnya `requestor_name` menjadi `owner`, `created_at` menjadi `submittedAt`, dan status `active` menjadi `Active`.
>
> Dengan pola ini, component UI tetap bersih. Component hanya fokus menampilkan loading, error, dan data sukses, sedangkan detail komunikasi backend ditangani di API layer.

## 16. Pertanyaan yang Mungkin Ditanyakan

### Kenapa tidak fetch langsung di component?

Supaya component lebih bersih. Component fokus pada UI, sedangkan API layer fokus pada komunikasi backend dan mapping data.

### Kenapa perlu mapping response?

Karena nama field backend tidak selalu sama dengan kebutuhan UI. Mapping membuat perubahan backend lebih mudah ditangani di satu tempat.

### Kenapa perlu `apiDataRequest`?

Karena backend mengirim response envelope. Daripada setiap feature membuka `payload.data`, helper ini membuat prosesnya konsisten.

### Kenapa perlu `apiItemsRequest`?

Karena response list bisa berupa array langsung atau `{ items: [...] }`. Helper ini menyamakan hasil akhirnya menjadi array.

### Bagaimana token dikirim?

Token diambil dari `localStorage`, lalu dikirim lewat header:

```txt
Authorization: Bearer <token>
```

### Apa yang terjadi jika token invalid?

Jika backend mengirim `401`, frontend menghapus data auth, membersihkan query cache, dan mengarahkan user ke `/login`.

### Apa bedanya mock API dan real API di project ini?

Mock API berasal dari MSW dan data in-memory. Real API berasal dari backend yang alamatnya diatur melalui `VITE_API_BASE_URL`.

## 17. Ringkasan yang Harus Dihafal

Poin utama:

- `.env` menentukan mock atau real API.
- `src/main.tsx` menentukan MSW aktif atau tidak.
- `src/api/client.ts` adalah pusat request ke backend.
- `apiRequest` menangani fetch, header, token, body, error, dan JSON.
- `apiDataRequest` mengambil `data` dari response envelope.
- `apiItemsRequest` memastikan response list menjadi array.
- `src/api/users.ts` dan `src/api/requests.ts` mapping response backend ke format UI.
- Component tidak fetch langsung. Component memakai hook dan React Query.
- React Query menangani loading, error, success, cache, dan refetch.
