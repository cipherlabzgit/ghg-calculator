type Props = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-5 py-10 text-center">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
