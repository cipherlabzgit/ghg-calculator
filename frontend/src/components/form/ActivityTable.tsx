import type { ReactNode } from "react";
import { EmptyState } from "../ui/EmptyState";

type Props = {
  emptyTitle: string;
  emptyBody: string;
  onAdd: () => void;
  addLabel: string;
  children: ReactNode;
  hasRows: boolean;
  loading?: boolean;
};

export function ActivityTable({ emptyTitle, emptyBody, onAdd, addLabel, children, hasRows, loading }: Props) {
  if (loading) {
    return <div className="h-24 animate-pulse rounded-lg bg-slate-100" aria-busy="true" />;
  }

  return (
    <div>
      {!hasRows ? <EmptyState title={emptyTitle} body={emptyBody} /> : <div className="space-y-4">{children}</div>}
      <button type="button" onClick={onAdd} className="btn-primary mt-4">
        + {addLabel}
      </button>
    </div>
  );
}

type RowCardProps = {
  title: string;
  onRemove: () => void;
  children: ReactNode;
};

export function RowCard({ title, onRemove, children }: RowCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <button type="button" onClick={onRemove} className="text-sm font-medium text-red-700 hover:underline">
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}
