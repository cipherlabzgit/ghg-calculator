type Props = {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  allowEmpty?: boolean;
  includeBlankOption?: boolean;
};

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
  includeBlankOption = true,
}: Props) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-800">{label}</span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      >
        {includeBlankOption ? <option value="">Choose…</option> : null}
        {options.map((option) => (
          <option key={`${id}-${option}`} value={option}>
            {option || "(none)"}
          </option>
        ))}
      </select>
    </label>
  );
}
