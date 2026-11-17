import { activityAmount, withMonthlyTotal } from "../../config/annualise";
import { CategorySection } from "../form/CategorySection";
import { FuelEditor } from "../form/FuelEditor";
import { ExcelCatalogTable } from "../form/ExcelCatalogTable";
import { useWizardDraft } from "../../hooks/useWizardDraft";
import { useFactors } from "../../hooks/useFactors";
import { useCountries } from "../../hooks/useCountries";
import { useMeta } from "../../hooks/useMeta";
import type { RefrigerantRow, VehicleRow } from "../../types";

export function FuelsSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  return (
    <CategorySection
      id="fuels"
      title="Fuels"
      tooltip="Combustion of fuels in owned or controlled stationary equipment."
      skipped={draft.skippedCategories.includes("fuels")}
      onToggleSkip={() => toggleSkip("fuels")}
      hideTitle
      plain
    >
      <FuelEditor
        category="fuels"
        rows={draft.scope1.fuels}
        source="DEFRA"
        vintage={2021}
        onChange={(fuels) => update((current) => ({ ...current, scope1: { ...current.scope1, fuels } }))}
      />
    </CategorySection>
  );
}

export function BioenergySheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  return (
    <CategorySection
      id="bioenergy"
      title="Bioenergy"
      tooltip="Combustion of fuels produced from recently living sources."
      skipped={draft.skippedCategories.includes("bioenergy")}
      onToggleSkip={() => toggleSkip("bioenergy")}
      hideTitle
      plain
    >
      <FuelEditor
        category="bioenergy"
        rows={draft.scope1.bioenergy}
        source="DEFRA"
        vintage={2021}
        hint="Please enter the amount for each applicable bioenergy source"
        onChange={(bioenergy) => update((current) => ({ ...current, scope1: { ...current.scope1, bioenergy } }))}
      />
    </CategorySection>
  );
}

export function RefrigerantsSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const refrigerants = useFactors("refrigerants");
  return (
    <CategorySection
      id="refrigerants"
      title="Refrigerant and others"
      tooltip="Leakage from air-conditioning and refrigeration units."
      skipped={draft.skippedCategories.includes("refrigerants")}
      onToggleSkip={() => toggleSkip("refrigerants")}
      hideTitle
      plain
    >
      <ExcelCatalogTable
        lines={refrigerants.tree}
        columns={[
          { key: "type", label: "Type", hideRepeat: true },
          { key: "emission", label: "Emission" },
          { key: "unit", label: "Unit" },
        ]}
        amounts={[{ key: "amount", label: "Amount" }]}
        monthlyInputs
        rows={draft.scope1.refrigerants.map((row) => ({
          ...row,
          type: row.protocol,
          emission: row.gas,
          unit: row.unit,
          amount: row.amount,
        }))}
        loading={refrigerants.loading}
        error={refrigerants.error}
        searchPlaceholder="Search gases…"
        hint="Please enter the amount for each applicable refrigerant."
        onChange={(next) =>
          update((current) => ({
            ...current,
            scope1: {
              ...current.scope1,
              refrigerants: next.map((row) => ({
                protocol: String(row.type ?? ""),
                gas: String(row.emission ?? ""),
                unit: String(row.unit ?? "kg"),
                ...withMonthlyTotal(row, "amount"),
              })) as RefrigerantRow[],
            },
          }))
        }
      />
    </CategorySection>
  );
}

export function OwnedVehiclesSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const vehicles = useFactors("ownedVehicles");
  const { countries } = useCountries();
  const { meta } = useMeta();
  const gef = countries.find((item) => item.name === draft.organisation.country)?.gefKgPerKwh ?? 0;
  const ukElec = meta?.ukElectricityKgPerKwh ?? 0;
  const lines = vehicles.tree.map((row) => {
    const ukEv = Number(row.evFactor ?? 0);
    return {
      ...row,
      evFactor: ukEv && ukElec ? (ukEv / ukElec) * gef : 0,
    };
  });
  return (
    <CategorySection
      id="ownedVehicles"
      title="Own or controlled vehicles"
      tooltip="Travel in cars and motorcycles owned or controlled by the organisation."
      skipped={draft.skippedCategories.includes("ownedVehicles")}
      onToggleSkip={() => toggleSkip("ownedVehicles")}
      hideTitle
      plain
    >
      <ExcelCatalogTable
        lines={lines}
        columns={[
          { key: "level1", label: "Level 1", hideRepeat: true },
          { key: "level2", label: "Level 2", hideRepeat: true },
          { key: "level3", label: "Level 3" },
          { key: "fuel", label: "Fuel" },
          { key: "unit", label: "Unit" },
        ]}
        factorLabel="Factor fuel"
        extraAfterFactor={[{ key: "evFactor", label: "Factor EV" }]}
        amounts={[{ key: "distanceKm", label: "Distance (km)" }]}
        monthlyInputs
        computeKg={(line, saved) =>
          activityAmount(saved, "distanceKm") * (Number(line.factor ?? 0) + Number(line.evFactor ?? 0))
        }
        rows={draft.scope1.ownedVehicles}
        loading={vehicles.loading}
        error={vehicles.error}
        searchPlaceholder="Search vehicles…"
        hint="Please enter the total distance for each type of vehicle. Factor EV uses your organisation country, as in the Excel sheet."
        onChange={(next) =>
          update((current) => ({
            ...current,
            scope1: {
              ...current.scope1,
              ownedVehicles: next.map((row) => ({
                level1: String(row.level1 ?? ""),
                level2: String(row.level2 ?? ""),
                level3: String(row.level3 ?? ""),
                fuel: String(row.fuel ?? ""),
                unit: String(row.unit ?? "km"),
                ...withMonthlyTotal(row, "distanceKm"),
              })) as VehicleRow[],
            },
          }))
        }
      />
    </CategorySection>
  );
}
