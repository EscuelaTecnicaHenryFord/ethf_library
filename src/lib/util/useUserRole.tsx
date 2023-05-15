import { api } from "~/utils/api";

export function useUserRole() {
    const { data, isInitialLoading, error } = api.getRole.useQuery()
    return {
        ...data,
        isLoading: isInitialLoading && !error,
    } || {
        isAdmin: false,
        isLoading: isInitialLoading && !error,
    }
}