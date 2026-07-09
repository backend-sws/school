type StatusMessageProps = {
  isLoading: boolean;
  isError: boolean;
  error?: any;
};

export default function StatusMessage({
  isLoading,
  isError,
  error,
}: StatusMessageProps) {
  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-600">
        Error: {error?.message || "Something went wrong"}
      </div>
    );
  }

  return null;
}
