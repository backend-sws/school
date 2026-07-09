export const CertificateHeadQueryKeys = {
  all: ["certificate-head"] as const,
  list: (filters?: Record<string, unknown>) =>
    filters
      ? ([...CertificateHeadQueryKeys.all, filters] as const)
      : CertificateHeadQueryKeys.all,
  detail: (id: number | string) =>
    [...CertificateHeadQueryKeys.all, String(id)] as const,
};
