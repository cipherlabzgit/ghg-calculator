import { withMonthlyTotal } from "../../config/annualise";
import { CategorySection } from "../form/CategorySection";
import { FuelEditor } from "../form/FuelEditor";
import { ExcelCatalogTable } from "../form/ExcelCatalogTable";
import { ExcelEntryTable } from "../form/ExcelEntryTable";
import { useWizardDraft } from "../../hooks/useWizardDraft";
import { useFactors } from "../../hooks/useFactors";
import { useMeta } from "../../hooks/useMeta";
import { useCountries } from "../../hooks/useCountries";
import type {
  FlightRow,
  FoodRow,
  FreightRow,
  HomeOfficeRow,
  HotelRow,
  MaterialRow,
  TravelRow,
  WasteRow,
  WaterRow,
} from "../../types";

export function WttFuelsSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  return (
    <CategorySection
      id="wttFuels"
      title="Well-to-tank fuels"
      tooltip="Upstream emissions from producing the fuels you already entered in Scope 1."
      skipped={draft.skippedCategories.includes("wttFuels")}
      onToggleSkip={() => toggleSkip("wttFuels")}
      hideTitle
      plain
    >
      <FuelEditor
        category="wttFuels"
        rows={draft.scope3.wttFuels}
        source="DEFRA"
        vintage={2021}
        factorLabel="Factors"
        hint="Emissions associated with extraction, refining and transportation of the raw fuel sources to an organisation’s site prior to their combustion."
        onChange={(wttFuels) => update((current) => ({ ...current, scope3: { ...current.scope3, wttFuels } }))}
      />
    </CategorySection>
  );
}

export function MaterialUseSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const material = useFactors("materialUse");
  return (
    <CategorySection
      id="materialUse"
      title="Material use"
      tooltip="Primary material production. Tonnes × DEFRA factor."
      skipped={draft.skippedCategories.includes("materialUse")}
      onToggleSkip={() => toggleSkip("materialUse")}
      hideTitle
      plain
    >
      <ExcelCatalogTable
        lines={material.tree}
        columns={[
          { key: "process", label: "Type", hideRepeat: true },
          { key: "activity", label: "Activity", hideRepeat: true },
          { key: "material", label: "Waste type" },
          { key: "unit", label: "Unit" },
        ]}
        identityKeys={["process", "activity", "material", "unit"]}
        factorLabel="Factors"
        amounts={[{ key: "tonnes", label: "Amount (tonnes)" }]}
        monthlyInputs
        rows={draft.scope3.materialUse}
        loading={material.loading}
        error={material.error}
        searchPlaceholder="Search materials…"
        hint="Please enter the amounts in tonnes for each of the material applicable to your organisation."
        onChange={(next) =>
          update((current) => ({
            ...current,
            scope3: {
              ...current.scope3,
              materialUse: next.map((row) => ({
                ...row,
                ...withMonthlyTotal(row, "tonnes"),
              })) as MaterialRow[],
            },
          }))
        }
      />
    </CategorySection>
  );
}

export function WasteDisposalSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const waste = useFactors("waste");
  return (
    <CategorySection
      id="waste"
      title="Waste disposal"
      tooltip="Waste sent to landfill, recycling and other routes."
      skipped={draft.skippedCategories.includes("waste")}
      onToggleSkip={() => toggleSkip("waste")}
      hideTitle
      plain
    >
      <ExcelCatalogTable
        lines={waste.tree}
        columns={[
          { key: "process", label: "Type", hideRepeat: true },
          { key: "activity", label: "Activity", hideRepeat: true },
          { key: "wasteType", label: "Waste type" },
          { key: "unit", label: "Unit" },
        ]}
        identityKeys={["process", "activity", "wasteType", "unit"]}
        factorLabel="Factors"
        amounts={[{ key: "amount", label: "Amount" }]}
        monthlyInputs
        rows={draft.scope3.waste}
        loading={waste.loading}
        error={waste.error}
        searchPlaceholder="Search waste…"
        hint="Please enter the amounts for the applicable waste type."
        onChange={(next) =>
          update((current) => ({
            ...current,
            scope3: {
              ...current.scope3,
              waste: next.map((row) => ({
                ...row,
                ...withMonthlyTotal(row, "amount"),
              })) as WasteRow[],
            },
          }))
        }
      />
    </CategorySection>
  );
}

export function FlightAccommodationSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const hotels = useFactors("hotels");
  const { meta } = useMeta();
  return (
    <>
      <CategorySection
        id="flights"
        title="Work flights"
        tooltip="Open the free ICAO calculator, then paste the kg CO2e number here."
        skipped={draft.skippedCategories.includes("flights")}
        onToggleSkip={() => toggleSkip("flights")}
        plain
      >
        <p className="mb-3 text-sm">
          <a
            className="text-brand-700 underline"
            href={meta?.icaoUrl || "https://www.icao.int/environmental-protection/Carbonoffset/Pages/default.aspx"}
            target="_blank"
            rel="noreferrer"
          >
            ICAO calculator
          </a>
        </p>
        <ExcelEntryTable
          hint="Please use the ICAO Calculator and add the information below."
          minRows={8}
          columns={[
            { key: "origin", label: "Origin (city or IATA code)", kind: "text" },
            { key: "destination", label: "Destination (city or IATA code)", kind: "text" },
            { key: "travelClass", label: "Class", kind: "select", options: ["Economy", "Business", "Private jet"] },
            { key: "tripType", label: "Single way / return", kind: "select", options: ["Single way", "Return"] },
            { key: "kgCO2e", label: "kg CO2e", kind: "number" },
          ]}
          blankRow={{ origin: "", destination: "", travelClass: "", tripType: "", kgCO2e: "" }}
          rows={draft.scope3.flights}
          onChange={(next) =>
            update((current) => ({
              ...current,
              scope3: {
                ...current.scope3,
                flights: next.map((row) => ({
                  origin: String(row.origin ?? ""),
                  destination: String(row.destination ?? ""),
                  travelClass: String(row.travelClass || "Economy"),
                  tripType: String(row.tripType || "Return"),
                  kgCO2e: String(row.kgCO2e ?? ""),
                })) as FlightRow[],
              },
            }))
          }
        />
      </CategorySection>

      <CategorySection
        id="hotels"
        title="Hotel nights"
        tooltip="Rooms × nights. Use the country where staff stayed."
        skipped={draft.skippedCategories.includes("hotels")}
        onToggleSkip={() => toggleSkip("hotels")}
        plain
      >
        <ExcelEntryTable
          hint="Please choose the country and number of nights per occupied room."
          minRows={8}
          columns={[
            {
              key: "country",
              label: "Country",
              kind: "select",
              options: hotels.tree.map((row) => String(row.country ?? "")).filter(Boolean),
            },
            { key: "rooms", label: "Number of occupied rooms", kind: "number" },
            { key: "nights", label: "Number of nights per room", kind: "number" },
          ]}
          blankRow={{ country: "", rooms: "", nights: "" }}
          rows={draft.scope3.hotels}
          factorLabel="Factors"
          factorFor={(row) => {
            const match = hotels.tree.find((item) => item.country === row.country);
            return match ? Number(match.factor ?? 0) : 0;
          }}
          kgFor={(row) => {
            const match = hotels.tree.find((item) => item.country === row.country);
            return Number(row.rooms ?? 0) * Number(row.nights ?? 0) * Number(match?.factor ?? 0);
          }}
          onChange={(next) =>
            update((current) => ({
              ...current,
              scope3: {
                ...current.scope3,
                hotels: next.map((row) => ({
                  country: String(row.country ?? ""),
                  rooms: String(row.rooms ?? ""),
                  nights: String(row.nights ?? ""),
                })) as HotelRow[],
              },
            }))
          }
        />
      </CategorySection>
    </>
  );
}

export function BusinessTravelSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const travel = useFactors("businessTravel");
  return (
    <TravelEditor
      id="businessTravel"
      title="Business travel — land and sea"
      tooltip="Ferry trips are reported as sea travel; all other modes are land travel."
      skipped={draft.skippedCategories.includes("businessTravel")}
      onToggle={() => toggleSkip("businessTravel")}
      tree={travel.tree}
      loading={travel.loading}
      error={travel.error}
      rows={draft.scope3.businessTravel}
      onChange={(businessTravel) =>
        update((current) => ({ ...current, scope3: { ...current.scope3, businessTravel } }))
      }
    />
  );
}

export function FreightingGoodsSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const freight = useFactors("freight");
  return (
    <CategorySection
      id="freight"
      title="Freighting goods"
      tooltip="Tonnes × kilometres × DEFRA freight factor."
      skipped={draft.skippedCategories.includes("freight")}
      onToggleSkip={() => toggleSkip("freight")}
      hideTitle
      plain
    >
      <ExcelCatalogTable
        lines={freight.tree}
        columns={[
          { key: "vehicle", label: "Vehicle", hideRepeat: true },
          { key: "type", label: "Type" },
          { key: "fuel", label: "Fuel" },
          { key: "unit", label: "Unit" },
        ]}
        factorLabel="Factors"
        amounts={[
          { key: "tonnes", label: "Weight (tonnes)" },
          { key: "km", label: "Distance (km)" },
        ]}
        rows={draft.scope3.freight}
        loading={freight.loading}
        error={freight.error}
        searchPlaceholder="Search deliveries…"
        onChange={(next) =>
          update((current) => ({
            ...current,
            scope3: { ...current.scope3, freight: next as FreightRow[] },
          }))
        }
      />
    </CategorySection>
  );
}

export function CommutingSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const commuting = useFactors("commuting");
  return (
    <TravelEditor
      id="commuting"
      title="Employee commuting"
      tooltip="Staff travel to work in vehicles you do not own."
      skipped={draft.skippedCategories.includes("commuting")}
      onToggle={() => toggleSkip("commuting")}
      tree={commuting.tree}
      loading={commuting.loading}
      error={commuting.error}
      rows={draft.scope3.commuting}
      onChange={(commutingRows) =>
        update((current) => ({ ...current, scope3: { ...current.scope3, commuting: commutingRows } }))
      }
    />
  );
}

export function FoodSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const { meta, loading, error } = useMeta();
  const lines = (meta?.food ?? []).map((item) => ({
    foodType: item.foodType,
    unit: item.unit,
    factor: item.factor,
  }));
  return (
    <CategorySection
      id="food"
      title="Food"
      tooltip="Meals and drinks provided by the organisation."
      skipped={draft.skippedCategories.includes("food")}
      onToggleSkip={() => toggleSkip("food")}
      hideTitle
      plain
    >
      <ExcelCatalogTable
        lines={lines}
        columns={[
          { key: "foodType", label: "Vehicle" },
          { key: "unit", label: "Unit" },
        ]}
        factorLabel="Factors"
        amounts={[{ key: "amount", label: "Amount" }]}
        monthlyInputs
        rows={draft.scope3.food.map((row) => ({
          ...row,
          unit: meta?.food.find((item) => item.foodType === row.foodType)?.unit ?? "",
        }))}
        loading={loading}
        error={error}
        hint="Please mind the units for each type of food."
        onChange={(next) =>
          update((current) => ({
            ...current,
            scope3: {
              ...current.scope3,
              food: next.map((row) => ({
                foodType: String(row.foodType ?? ""),
                ...withMonthlyTotal(row, "amount"),
              })) as FoodRow[],
            },
          }))
        }
      />
    </CategorySection>
  );
}

export function HomeOfficeSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const { meta, loading, error } = useMeta();
  const { countries } = useCountries();
  const gef = countries.find((item) => item.name === draft.organisation.country)?.gefKgPerKwh ?? 0;
  const hoursPerMonth = meta?.homeOffice.hoursPerMonth ?? 160;
  const lines = (meta?.homeOffice.types ?? []).map((item) => ({
    officeType: item.officeType,
    unit: item.unit,
    country: draft.organisation.country || "Choose a country from the list",
    consumption: item.kWhPerHour,
    factor: item.kWhPerHour * gef,
  }));
  return (
    <CategorySection
      id="homeOffice"
      title="Home office"
      tooltip="Enter employees, working time and work-from-home as percentages from 0 to 100."
      skipped={draft.skippedCategories.includes("homeOffice")}
      onToggleSkip={() => toggleSkip("homeOffice")}
      hideTitle
      plain
    >
      <ExcelCatalogTable
        lines={lines}
        columns={[
          { key: "officeType", label: "Type of home office" },
          { key: "country", label: "Country" },
          { key: "unit", label: "Unit" },
        ]}
        extraBeforeFactor={[{ key: "consumption", label: "Consumption kWh/hour" }]}
        factorLabel="Factors"
        amounts={[
          { key: "employees", label: "Number of employees" },
          { key: "workingRegimePercent", label: "Working regime (For full-time: 100%)" },
          { key: "wfhPercent", label: "% working from home (e.g. 50% from home)" },
          { key: "months", label: "Number of months" },
        ]}
        rows={draft.scope3.homeOffice}
        loading={loading}
        error={error}
        hint="The emission factors consider the energy consumption of the workstation, lighting, and cooling or heating."
        computeKg={(line, saved) => {
          const employees = Number(saved?.employees ?? 0);
          const regime = Number(saved?.workingRegimePercent ?? 0) / 100;
          const wfh = Number(saved?.wfhPercent ?? 0) / 100;
          const months = Number(saved?.months ?? 0);
          return employees * regime * hoursPerMonth * wfh * Number(line.consumption ?? 0) * gef * months;
        }}
        onChange={(next) =>
          update((current) => ({
            ...current,
            scope3: {
              ...current.scope3,
              homeOffice: next.map((row) => ({
                officeType: String(row.officeType ?? ""),
                country: String(row.country || current.organisation.country),
                employees: String(row.employees ?? ""),
                workingRegimePercent: String(row.workingRegimePercent ?? ""),
                wfhPercent: String(row.wfhPercent ?? ""),
                months: String(row.months ?? ""),
              })) as HomeOfficeRow[],
            },
          }))
        }
      />
    </CategorySection>
  );
}

export function WaterSheet() {
  const { draft, update, toggleSkip } = useWizardDraft();
  const water = useFactors("water");
  const lines = water.tree.length
    ? water.tree.map((row) => ({
        kind: row.kind,
        label: row.label || (row.kind === "supply" ? "Water Supply" : "Water Treatment"),
        unit: row.unit || "cubic metres",
        factor: row.factor,
      }))
    : [
        { kind: "supply", label: "Water Supply", unit: "cubic metres", factor: 0.149 },
        { kind: "treatment", label: "Water Treatment", unit: "cubic metres", factor: 0.272 },
      ];
  return (
    <CategorySection
      id="water"
      title="Water"
      tooltip="Mains water supply and wastewater treatment. DEFRA 2021, cubic metres."
      skipped={draft.skippedCategories.includes("water")}
      onToggleSkip={() => toggleSkip("water")}
      hideTitle
      plain
    >
      <ExcelCatalogTable
        lines={lines}
        columns={[
          { key: "label", label: "Type" },
          { key: "unit", label: "Unit" },
        ]}
        factorLabel="Factors"
        amounts={[{ key: "amount", label: "Amount" }]}
        monthlyInputs
        rows={draft.scope3.water.map((row) => ({
          ...row,
          kind: row.kind,
          label: row.kind === "supply" ? "Water Supply" : "Water Treatment",
          unit: row.unit,
          amount: row.amount,
        }))}
        loading={water.loading}
        error={water.error}
        onChange={(next) =>
          update((current) => ({
            ...current,
            scope3: {
              ...current.scope3,
              water: next.map((row) => ({
                kind: (row.kind === "treatment" ? "treatment" : "supply") as WaterRow["kind"],
                unit: String(row.unit || "cubic metres"),
                ...withMonthlyTotal(row, "amount"),
              })),
            },
          }))
        }
      />
    </CategorySection>
  );
}

function TravelEditor({
  id,
  title,
  tooltip,
  skipped,
  onToggle,
  tree,
  loading,
  error,
  rows,
  onChange,
}: {
  id: string;
  title: string;
  tooltip: string;
  skipped: boolean;
  onToggle: () => void;
  tree: Array<Record<string, string | number>>;
  loading: boolean;
  error?: string | null;
  rows: TravelRow[];
  onChange: (rows: TravelRow[]) => void;
}) {
  return (
    <CategorySection id={id} title={title} tooltip={tooltip} skipped={skipped} onToggleSkip={onToggle} hideTitle plain>
      <ExcelCatalogTable
        lines={tree}
        columns={[
          { key: "vehicle", label: "Vehicle", hideRepeat: true },
          { key: "type", label: "Type" },
          { key: "fuel", label: "Fuel" },
          { key: "unit", label: "Unit" },
        ]}
        factorLabel="Factors"
        amounts={[{ key: "distance", label: "Total distance" }]}
        monthlyInputs
        rows={rows}
        loading={loading}
        error={error}
        searchPlaceholder="Search trips…"
        onChange={(next) =>
          onChange(
            next.map((row) => ({
              ...row,
              ...withMonthlyTotal(row, "distance"),
            })) as TravelRow[],
          )
        }
      />
    </CategorySection>
  );
}
