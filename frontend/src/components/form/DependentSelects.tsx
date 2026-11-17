import { uniqueField, type OptionRow } from "../../utils/trees";
import { SelectField } from "./SelectField";

type CascadeField = {
  key: string;
  label: string;
};

type Props = {
  idPrefix: string;
  fields: CascadeField[];
  tree: OptionRow[];
  values: OptionRow;
  onChange: (next: OptionRow) => void;
};

export function DependentSelects({ idPrefix, fields, tree, values, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field, index) => {
        const filters: OptionRow = {};
        fields.slice(0, index).forEach((prior) => {
          filters[prior.key] = values[prior.key] ?? "";
        });
        const options = uniqueField(tree, field.key, filters);
        const previous = index > 0 ? fields[index - 1] : undefined;
        const previousFilters: OptionRow = {};
        fields.slice(0, Math.max(index - 1, 0)).forEach((prior) => {
          previousFilters[prior.key] = values[prior.key] ?? "";
        });
        const previousOptions = previous ? uniqueField(tree, previous.key, previousFilters) : [];
        const previousValue = previous ? (values[previous.key] ?? "") : "";
        const previousAllowsEmpty = previousOptions.includes("");
        const disabled = Boolean(previous) && previousValue === "" && !previousAllowsEmpty;
        return (
          <SelectField
            key={field.key}
            id={`${idPrefix}-${field.key}`}
            label={field.label}
            value={values[field.key] ?? ""}
            options={options}
            disabled={disabled}
            onChange={(value) => {
              const next: OptionRow = { ...values, [field.key]: value };
              fields.slice(index + 1).forEach((later) => {
                next[later.key] = "";
              });
              onChange(next);
            }}
          />
        );
      })}
    </div>
  );
}
