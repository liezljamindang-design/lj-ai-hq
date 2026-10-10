import { useHq } from "../store/hqStore";

/** The global Live Activity list, newest first. New entries ease in once; nothing flashes or loops. */
export function ActivityFeed({ limit, onRetry }: { limit: number; onRetry: () => void }) {
  const activity = useHq((s) => s.activity);
  const state = useHq((s) => s.activityState);

  if (state === "loading") return <p className="muted">Loading activity…</p>;
  if (state === "error") {
    return (
      <p className="muted">
        Activity didn't load.{" "}
        <button type="button" className="link-btn" onClick={onRetry}>Try again</button>
      </p>
    );
  }
  if (activity.length === 0) return <p className="muted">No activity yet.</p>;

  return (
    <ol className="feed">
      {activity.slice(0, limit).map((e) => (
        <li key={e.id} className={e.id.startsWith("demo-") ? "feed-new" : undefined}>
          <time>{e.time}</time>
          <span>{e.text}</span>
        </li>
      ))}
    </ol>
  );
}
