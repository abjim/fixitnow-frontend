import { Star } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/empty-state';
import { getMyReviews } from '@/lib/queries';
import { dateOnly } from '@/lib/format';

export default async function CustomerReviewsPage() {
  const res = await getMyReviews();
  const reviews = res.data ?? [];

  return (
    <>
      <PageHeader
        title="My reviews"
        description="Feedback you left after completed jobs."
      />

      {reviews.length === 0 ? (
        <EmptyState
          title="No review yet"
          description="After a job is completed you can rate the technician."
          icon={Star}
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {review.booking?.service.title ?? 'Service'}
                  <span className="text-muted-foreground">
                    {' '}
                    · {review.technician?.user.name}
                  </span>
                </p>
                <span className="text-xs text-muted-foreground">
                  {dateOnly(review.createdAt)}
                </span>
              </div>

              <div className="mt-1.5 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? 'size-4 fill-amber-400 text-amber-400'
                        : 'size-4 text-muted-foreground/40'
                    }
                  />
                ))}
              </div>

              {review.comment && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
