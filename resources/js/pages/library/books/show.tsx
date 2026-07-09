import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, Pencil, Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import libraryApi from "@/lib/api/libraryApi";
import { LIBRARY_BOOKS_BREADCRUMBS } from "@/constants/page/admin/library";
import { PermissionGate } from "@/components/PermissionGate";
import Each from '@/components/Each';

type PageProps = { id: number };

const LibraryBooksShow = ({ id }: PageProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["library-book", id],
    queryFn: () => libraryApi.books.show(id),
  });

  const book = data?.data as
    | {
        id: number;
        title: string;
        author?: string | null;
        isbn?: string | null;
        edition?: string | null;
        description?: string | null;
        is_active?: boolean;
        copies?: { id: number; barcode?: string | null; is_available: boolean }[];
      }
    | undefined;

  return (
    <>
      <Head title={book?.title ?? "Book"} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <MainPageHeader
            breadcrumbs={LIBRARY_BOOKS_BREADCRUMBS}
            icon={BookOpen}
            title={book?.title ?? "Book"}
            subtitle={book?.author ?? "—"}
          />
          <PermissionGate can="update_library_books">
            <Button asChild>
              <Link href={`/library/books/${id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
          </PermissionGate>
        </div>
        {isLoading && <p className="text-muted-foreground">Loading...</p>}
        {book && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Details</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="text-muted-foreground">Author:</span>{" "}
                {book.author ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">ISBN:</span>{" "}
                {book.isbn ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Edition:</span>{" "}
                {book.edition ?? "—"}
              </p>
              {book.description && (
                <p>
                  <span className="text-muted-foreground">Description:</span>{" "}
                  {book.description}
                </p>
              )}
            </CardContent>
          </Card>
        )}
        {book?.copies && book.copies.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold">Copies ({book.copies.length})</h3>
              <PermissionGate can="create_library_copies">
                <Button asChild>
                  <Link href={`/library/copies/create?book_id=${id}`}>
                    <Copy className="size-4" />
                    Add Copy
                  </Link>
                </Button>
              </PermissionGate>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <Each
                    of={book.copies}
                    keyExtractor={(c) => String(c.id)}
                    render={(c) => (
                  <li key={c.id} className="flex items-center gap-2">
                    <Link
                      href={`/library/copies/${c.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      {c.barcode ?? `Copy #${c.id}`}
                    </Link>
                    <span
                      className={
                        c.is_available
                          ? "text-green-600"
                          : "text-amber-600"
                      }
                    >
                      {c.is_available ? "Available" : "Issued"}
                    </span>
                  </li>
                )}
                />
              </ul>
            </CardContent>
          </Card>
        )}
        <Button variant="outline" asChild>
          <Link href="/library/books">Back to Books</Link>
        </Button>
      </div>
    </>
  );
};

export default LibraryBooksShow;
