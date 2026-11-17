import type { ComponentType } from "react";
import { Navigate, useParams } from "react-router-dom";
import { WizardLayout } from "../components/layout/WizardLayout";
import { WizardNav } from "../components/form/WizardNav";
import { adjacentSheets, getSheet } from "../config/sheets";
import { BioenergySheet, FuelsSheet, OwnedVehiclesSheet, RefrigerantsSheet } from "../components/sheets/DirectSheets";
import { EnergySheet } from "../components/sheets/EnergySheet";
import {
  BusinessTravelSheet,
  CommutingSheet,
  FlightAccommodationSheet,
  FoodSheet,
  FreightingGoodsSheet,
  HomeOfficeSheet,
  MaterialUseSheet,
  WasteDisposalSheet,
  WaterSheet,
  WttFuelsSheet,
} from "../components/sheets/ValueChainSheets";

const EDITORS: Record<string, ComponentType> = {
  fuels: FuelsSheet,
  bioenergy: BioenergySheet,
  refrigerants: RefrigerantsSheet,
  energy: EnergySheet,
  "owned-vehicles": OwnedVehiclesSheet,
  "wtt-fuels": WttFuelsSheet,
  "material-use": MaterialUseSheet,
  "waste-disposal": WasteDisposalSheet,
  "flight-accommodation": FlightAccommodationSheet,
  "business-travel": BusinessTravelSheet,
  "freighting-goods": FreightingGoodsSheet,
  commuting: CommutingSheet,
  food: FoodSheet,
  "home-office": HomeOfficeSheet,
  water: WaterSheet,
};

export function SheetPage() {
  const { sheetId } = useParams();
  const sheet = getSheet(sheetId);
  if (!sheet || !EDITORS[sheet.id]) {
    return <Navigate to="/organisation" replace />;
  }

  const Editor = EDITORS[sheet.id];
  const nav = adjacentSheets(sheet.id);

  return (
    <WizardLayout currentPath={sheet.path} title={sheet.excelName} intro={sheet.intro}>
      <Editor />
      <WizardNav
        backTo={nav.prev?.path}
        nextTo={nav.next?.path ?? "/report"}
        nextLabel={nav.next?.id === "report" ? "See my results" : "Continue"}
      />
    </WizardLayout>
  );
}
