import { useQuery } from "@tanstack/react-query";
import { fetchPharmacyProfile } from "@/services/PharmacyProfile";
import { PharmacyProfile } from "@/types/PharmacyProfile";
import { queryKeys } from "@/lib/queryKeys";

export function usePharmacyProfile() {
  const query = useQuery<PharmacyProfile>({
    queryKey: queryKeys.pharmacy.profile(),
    queryFn: fetchPharmacyProfile,
  });

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? "Failed to load profile" : null,
    refetch: query.refetch,
  };
}
