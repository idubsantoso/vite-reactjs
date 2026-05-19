import type { UserListQuery } from "../_types/user-list-query"

export const userQueryDefaults: UserListQuery = {
  search: "",
  role: "",
  status: "",
  page: 1,
  pageSize: 10,
}
