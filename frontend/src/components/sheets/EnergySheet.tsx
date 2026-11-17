import { activityAmount, hasMonthlyValues, pickMonthly, withMonthlyTotal } from "../../config/annualise";
import { CategorySection } from "../form/CategorySection";
import { ExcelCatalogTable } from "../form/ExcelCatalogTable";
import { useShowFactors } from "../../hooks/useShowFactors";
import { useWizardDraft } from "../../hooks/useWizardDraft";
import { useFactors } from "../../hooks/useFactors";
import { useCountries } from "../../hooks/useCountries";
import { useMeta } from "../../hooks/useMeta";
import type { ElectricityRow, HeatSteamRow } from "../../types";

export function EnergySheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const { showFactors } = useShowFactors();
  const heat = useFactors("heatSteam");
  const { countries } = useCountries();
  const { meta } = useMeta();
  const skipped = (id: string) => draft.skippedCategories.includes(id);
  const country = draft.organisation.country || "Choose a country from the list";
  const savedPower = draft.scope2.electricity[0];
  const countryGef = countries.find((item) => item.name === draft.organisation.country)?.gefKgPerKwh ?? 0;
  const tdDefault = meta?.tdElectricityKgPerKwh ?? 0.01879;
  const gef = savedPower?.customGef !== "" && savedPower?.customGef != null ? Number(savedPower.customGef) : countryGef;
  const td =
    savedPower?.customTd !== "" && savedPower?.customTd != null ? Number(savedPower.customTd) : tdDefault;
  const renewable = savedPower?.renewable ?? false;
  const gefShown = renewable ? 0 : Number.isFinite(gef) ? gef : 0;
  const tdShown = renewable ? 0 : Number.isFinite(td) ? td : 0;

  function patchElectricity(partial: Partial<ElectricityRow>) {
    update((current) => {
      const previous = current.scope2.electricity[0] ?? {
        country: current.organisation.country,
        kWh: "",
        renewable: false,
        customGef: "",
        customTd: "",
      };
      const next = { ...previous, country: current.organisation.country, ...partial };
      const empty = String(next.kWh ?? "").trim() === "" && !hasMonthlyValues(next);
      return {
        ...current,
        scope2: {
          ...current.scope2,
          electricity: empty ? [] : [next],
        },
      };
    });
  }

  return (
    <>
      <CategorySection
        id="electricity"
        title="Electricity Grid"
        tooltip="Electricity used at sites you own or control. Renewable energy contract = 0."
        skipped={skipped("electricity")}
        onToggleSkip={() => toggleSkip("electricity")}
        plain
      >
        <ExcelCatalogTable
          lines={[
            {
              activity: "Electricity",
              country,
              unit: "kWh",
              gef: gefShown,
              td: tdShown,
            },
          ]}
          columns={[
            { key: "activity", label: "Activity" },
            { key: "country", label: "Country" },
            { key: "unit", label: "Unit" },
          ]}
          showFactor={false}
          extraAfterFactor={[
            { key: "gef", label: "GEF Factors KgCO2" },
            { key: "td", label: "T&D Factors KgCO2" },
          ]}
          amounts={[{ key: "amount", label: "Amount" }]}
          monthlyInputs
          showKg={false}
          extraKg={[
            {
              label: "GEF kg CO2e",
              compute: (line, saved) => activityAmount(saved, "amount") * Number(line.gef ?? 0),
            },
            {
              label: "T&D kg CO2e",
              compute: (line, saved) => activityAmount(saved, "amount") * Number(line.td ?? 0),
            },
          ]}
          rows={[
            {
              activity: "Electricity",
              country,
              unit: "kWh",
              amount: savedPower?.kWh ?? "",
              ...pickMonthly(savedPower),
            },
          ]}
          hint="Electricity used by an organisation at sites owned/controlled by them. For renewable energy contracts, the emissions are equal to zero."
          onChange={(next) => {
            const row = next[0] ?? {};
            const fields = withMonthlyTotal(row, "amount");
            patchElectricity({ kWh: String(fields.amount ?? ""), ...pickMonthly(row) });
          }}
        />
        <label className="mt-3 flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={renewable}
            onChange={(event) => {
              const checked = event.target.checked;
              update((current) => {
                const previous = current.scope2.electricity[0];
                if (!previous) {
                  return {
                    ...current,
                    scope2: {
                      ...current.scope2,
                      electricity: [
                        {
                          country: current.organisation.country,
                          kWh: "",
                          renewable: checked,
                          customGef: "",
                          customTd: "",
                        },
                      ],
                    },
                  };
                }
                return {
                  ...current,
                  scope2: {
                    ...current.scope2,
                    electricity: [{ ...previous, renewable: checked }],
                  },
                };
              });
            }}
          />
          Renewable energy contract (Yes/No)
        </label>
        {showFactors ? (
          <>
            <p className="mt-3 text-sm font-medium text-slate-800">
              OR enter your own emission factor value
            </p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-medium">GEF Factors KgCO2</span>
                <input
                  className="field"
                  type="number"
                  min={0}
                  step="any"
                  value={savedPower?.customGef ?? ""}
                  placeholder={countryGef ? String(countryGef) : "0"}
                  onChange={(event) => patchElectricity({ customGef: event.target.value })}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium">T&D Factors KgCO2</span>
                <input
                  className="field"
                  type="number"
                  min={0}
                  step="any"
                  value={savedPower?.customTd ?? ""}
                  placeholder={String(tdDefault)}
                  onChange={(event) => patchElectricity({ customTd: event.target.value })}
                />
              </label>
            </div>
          </>
        ) : null}
      </CategorySection>

      <CategorySection
        id="heatSteam"
        title="Heat and steam"
        tooltip="Purchased heat or steam for heating or industrial processes."
        skipped={skipped("heatSteam")}
        onToggleSkip={() => toggleSkip("heatSteam")}
        plain
      >
        <ExcelCatalogTable
          lines={heat.tree}
          columns={[
            { key: "activity", label: "Activity" },
            { key: "type", label: "Type" },
            { key: "unit", label: "Unit" },
          ]}
          factorLabel="Factors"
          extraAfterFactor={[{ key: "tdFactor", label: "T&D Factors" }]}
          amounts={[{ key: "amount", label: "Amount" }]}
          monthlyInputs
          extraKg={[
            {
              label: "T&D kg CO2e",
              compute: (line, saved) => activityAmount(saved, "amount") * Number(line.tdFactor ?? 0),
            },
          ]}
          rows={draft.scope2.heatSteam.map((row) => ({
            activity: "Heat and steam",
            type: row.type,
            unit: "kWh",
            amount: row.kWh,
            ...pickMonthly(row),
          }))}
          loading={heat.loading}
          error={heat.error}
          hint="For heating from other sources, please use the Fuels tab."
          onChange={(next) =>
            update((current) => ({
              ...current,
              scope2: {
                ...current.scope2,
                heatSteam: next.map((row) => {
                  const fields = withMonthlyTotal(row, "amount");
                  return {
                    type: String(row.type ?? "District heat and steam"),
                    kWh: String(fields.amount ?? ""),
                    ...pickMonthly(row),
                  };
                }) as HeatSteamRow[],
              },
            }))
          }
        />
      </CategorySection>

      <CategorySection
        id="districtCooling"
        title="District cooling"
        tooltip="Air conditioning from chilled water in a centralized energy plant."
        skipped={skipped("districtCooling")}
        onToggleSkip={() => toggleSkip("districtCooling")}
        plain
      >
        <ExcelCatalogTable
          lines={[
            {
              activity: "District cooling",
              country,
              unit: "Ton of refrigeration",
              factor: countryGef * 0.9,
            },
          ]}
          columns={[
            { key: "activity", label: "Activity" },
            { key: "country", label: "Country" },
            { key: "unit", label: "Unit" },
          ]}
          factorLabel="Factors"
          amounts={[{ key: "amount", label: "Amount" }]}
          monthlyInputs
          rows={[
            {
              activity: "District cooling",
              country,
              unit: "Ton of refrigeration",
              amount: draft.scope2.districtCoolingTons,
              ...pickMonthly(draft.scope2.districtCoolingMonthly),
            },
          ]}
          onChange={(next) => {
            const row = next[0] ?? {};
            const fields = withMonthlyTotal(row, "amount");
            update((current) => ({
              ...current,
              scope2: {
                ...current.scope2,
                districtCoolingTons: String(fields.amount ?? ""),
                districtCoolingMonthly: pickMonthly(row),
              },
            }));
          }}
        />
      </CategorySection>
    </>
  );
}
