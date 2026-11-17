import type { CalculateRequest, CalculateResponse, CategoryResult } from "../types";
import { categoryResult, emptyCategory, kgToTonnes } from "./calcUtils";
import { calculateFuels } from "./fuels";
import { calculateBioenergy } from "./bioenergy";
import { calculateRefrigerants } from "./refrigerants";
import { calculateOwnedVehicles } from "./ownedVehicles";
import { calculateElectricity } from "./electricity";
import { calculateHeatSteam } from "./heatSteam";
import { calculateDistrictCooling } from "./districtCooling";
import { calculateWttFuels } from "./wttFuels";
import { collectTdLosses } from "./tdLosses";
import { calculateWater } from "./water";
import { calculateMaterialUse } from "./materialUse";
import { calculateWaste } from "./waste";
import { calculateFlights } from "./flights";
import { calculateHotels } from "./hotels";
import { calculateBusinessTravel } from "./businessTravel";
import { calculateFreight } from "./freight";
import { calculateCommuting } from "./commuting";
import { calculateFood } from "./food";
import { calculateHomeOffice } from "./homeOffice";

function skipped(ids: string[], id: string): boolean {
  return ids.includes(id);
}

export function aggregateReport(input: CalculateRequest): CalculateResponse {
  const skip = input.skippedCategories ?? [];
  const country = input.organisation.country;

  const fuels = skipped(skip, "fuels")
    ? emptyCategory("fuels", 1, "Fuels", true)
    : categoryResult("fuels", 1, "Fuels", calculateFuels(input.scope1.fuels), false);

  const bioenergy = skipped(skip, "bioenergy")
    ? emptyCategory("bioenergy", 1, "Bioenergy", true)
    : categoryResult("bioenergy", 1, "Bioenergy", calculateBioenergy(input.scope1.bioenergy), false);

  const refrigerants = skipped(skip, "refrigerants")
    ? emptyCategory("refrigerants", 1, "Refrigerants", true)
    : categoryResult("refrigerants", 1, "Refrigerants", calculateRefrigerants(input.scope1.refrigerants), false);

  const owned = skipped(skip, "ownedVehicles")
    ? { passenger: [], delivery: [], evElectricity: [] }
    : calculateOwnedVehicles(input.scope1.ownedVehicles, country);

  const passengerVehicles = skipped(skip, "ownedVehicles")
    ? emptyCategory("passengerVehicles", 1, "Passenger vehicles", true)
    : categoryResult("passengerVehicles", 1, "Passenger vehicles", owned.passenger, false);

  const deliveryVehicles = skipped(skip, "ownedVehicles")
    ? emptyCategory("deliveryVehicles", 1, "Delivery vehicles", true)
    : categoryResult("deliveryVehicles", 1, "Delivery vehicles", owned.delivery, false);

  const electricity = skipped(skip, "electricity")
    ? { generation: [], tdLosses: [] }
    : calculateElectricity(input.scope2.electricity);

  const heat = skipped(skip, "heatSteam")
    ? { generation: [], tdLosses: [] }
    : calculateHeatSteam(input.scope2.heatSteam);

  const electricityCat = skipped(skip, "electricity")
    ? emptyCategory("electricity", 2, "Electricity", true)
    : categoryResult("electricity", 2, "Electricity", electricity.generation, false);

  const heatSteam = skipped(skip, "heatSteam")
    ? emptyCategory("heatSteam", 2, "Heat and steam", true)
    : categoryResult("heatSteam", 2, "Heat and steam", heat.generation, false);

  const electricityForEvs = skipped(skip, "ownedVehicles")
    ? emptyCategory("electricityForEvs", 2, "Electricity for EVs", true)
    : categoryResult("electricityForEvs", 2, "Electricity for EVs", owned.evElectricity, false);

  const cooling = skipped(skip, "districtCooling")
    ? emptyCategory("districtCooling", 2, "District cooling", true)
    : categoryResult(
        "districtCooling",
        2,
        "District cooling",
        calculateDistrictCooling(input.scope2.districtCooling, country),
        false,
      );

  const wttFuels = skipped(skip, "wttFuels")
    ? emptyCategory("wttFuels", 3, "Well-to-tank fuels", true)
    : categoryResult("wttFuels", 3, "Well-to-tank fuels", calculateWttFuels(input.scope3.wttFuels), false);

  const tdSkipped = skipped(skip, "electricity") && skipped(skip, "heatSteam");
  const tdLosses = tdSkipped
    ? emptyCategory("tdLosses", 3, "Transmission and distribution losses", true)
    : categoryResult(
        "tdLosses",
        3,
        "Transmission and distribution losses",
        collectTdLosses(
          skipped(skip, "electricity") ? [] : electricity.tdLosses,
          skipped(skip, "heatSteam") ? [] : heat.tdLosses,
        ),
        false,
      );

  const water = skipped(skip, "water")
    ? { supply: [], treatment: [] }
    : calculateWater(input.scope3.water);

  const wasteWater = skipped(skip, "water")
    ? emptyCategory("wasteWater", 3, "Waste water", true)
    : categoryResult("wasteWater", 3, "Waste water", water.treatment, false);

  const waterSupplied = skipped(skip, "water")
    ? emptyCategory("waterSupplied", 3, "Water supplied", true)
    : categoryResult("waterSupplied", 3, "Water supplied", water.supply, false);

  const waste = skipped(skip, "waste")
    ? emptyCategory("waste", 3, "Waste", true)
    : categoryResult("waste", 3, "Waste", calculateWaste(input.scope3.waste), false);

  const materialUse = skipped(skip, "materialUse")
    ? emptyCategory("materialUse", 3, "Material use", true)
    : categoryResult("materialUse", 3, "Material use", calculateMaterialUse(input.scope3.materialUse), false);

  const flights = skipped(skip, "flights")
    ? emptyCategory("flights", 3, "Flights", true)
    : categoryResult("flights", 3, "Flights", calculateFlights(input.scope3.flights), false);

  const hotels = skipped(skip, "hotels")
    ? emptyCategory("hotels", 3, "Hotels", true)
    : categoryResult("hotels", 3, "Hotels", calculateHotels(input.scope3.hotels), false);

  const travel = skipped(skip, "businessTravel")
    ? { sea: [], land: [] }
    : calculateBusinessTravel(input.scope3.businessTravel);

  const seaTravel = skipped(skip, "businessTravel")
    ? emptyCategory("seaTravel", 3, "Business travel — sea", true)
    : categoryResult("seaTravel", 3, "Business travel — sea", travel.sea, false);

  const landTravel = skipped(skip, "businessTravel")
    ? emptyCategory("landTravel", 3, "Business travel — land", true)
    : categoryResult("landTravel", 3, "Business travel — land", travel.land, false);

  const freight = skipped(skip, "freight")
    ? emptyCategory("freight", 3, "Freighting goods", true)
    : categoryResult("freight", 3, "Freighting goods", calculateFreight(input.scope3.freight), false);

  const commuting = skipped(skip, "commuting")
    ? emptyCategory("commuting", 3, "Employee commuting", true)
    : categoryResult("commuting", 3, "Employee commuting", calculateCommuting(input.scope3.commuting), false);

  const food = skipped(skip, "food")
    ? emptyCategory("food", 3, "Food", true)
    : categoryResult("food", 3, "Food", calculateFood(input.scope3.food), false);

  const homeOffice = skipped(skip, "homeOffice")
    ? emptyCategory("homeOffice", 3, "Home office", true)
    : categoryResult("homeOffice", 3, "Home office", calculateHomeOffice(input.scope3.homeOffice), false);

  const categories: CategoryResult[] = [
    fuels,
    bioenergy,
    refrigerants,
    passengerVehicles,
    deliveryVehicles,
    electricityCat,
    heatSteam,
    electricityForEvs,
    cooling,
    wttFuels,
    tdLosses,
    wasteWater,
    waste,
    waterSupplied,
    materialUse,
    flights,
    hotels,
    seaTravel,
    landTravel,
    freight,
    commuting,
    food,
    homeOffice,
  ];

  const scope1tCO2e = kgToTonnes(
    fuels.kgCO2e + bioenergy.kgCO2e + refrigerants.kgCO2e + passengerVehicles.kgCO2e + deliveryVehicles.kgCO2e,
  );
  const scope2tCO2e = kgToTonnes(
    electricityCat.kgCO2e + heatSteam.kgCO2e + electricityForEvs.kgCO2e + cooling.kgCO2e,
  );
  const scope3tCO2e = kgToTonnes(
    wttFuels.kgCO2e +
      tdLosses.kgCO2e +
      wasteWater.kgCO2e +
      waste.kgCO2e +
      waterSupplied.kgCO2e +
      materialUse.kgCO2e +
      flights.kgCO2e +
      hotels.kgCO2e +
      seaTravel.kgCO2e +
      landTravel.kgCO2e +
      freight.kgCO2e +
      commuting.kgCO2e +
      food.kgCO2e +
      homeOffice.kgCO2e,
  );

  return {
    organisation: input.organisation,
    title: `${input.organisation.name} - ${input.organisation.period} GHG emissions report`,
    categories,
    scope1tCO2e,
    scope2tCO2e,
    scope3tCO2e,
    totaltCO2e: scope1tCO2e + scope2tCO2e + scope3tCO2e,
  };
}
