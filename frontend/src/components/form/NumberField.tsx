type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: string;
  error?: string;
};

export function NumberField({ id, label, value, onChange, unit, min = 0, max, step = "any", error }: Props) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-800">
        {label}
        {unit ? <span className="ml-1 font-normal text-slate-500">({unit})</span> : null}
      </span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      />
      {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : null}
    </label>
  );
}
