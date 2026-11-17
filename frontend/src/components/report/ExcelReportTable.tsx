import type { CalculateResponse } from "../../types";
import { formatExcelTonnes } from "../../utils/format";
import { buildReportTitle, tonnesForCategory } from "../../utils/reportSheet";

type Props = {
  report: CalculateResponse;
};

function Value({ amount }: { amount: number }) {
  return <td className="excel-report-value">{formatExcelTonnes(amount)}</td>;
}

export function ExcelReportTable({ report }: Props) {
  const tonnes = (id: string) => tonnesForCategory(report.categories, id);

  return (
    <div className="excel-wrap overflow-x-auto rounded-md border border-[#8fbc8f] bg-white">
      <table className="excel-report">
        <caption className="sr-only">GHG emissions report in t CO2e</caption>
        <colgroup>
          <col className="excel-report-col-spine" />
          <col className="excel-report-col-spine" />
          <col className="excel-report-col-group" />
          <col className="excel-report-col-source" />
          <col className="excel-report-col-value" />
        </colgroup>
        <thead>
          <tr>
            <th colSpan={5} className="excel-report-title">
              {buildReportTitle(report)}
            </th>
          </tr>
          <tr>
            <th colSpan={2}>Category</th>
            <th colSpan={2}>Emission source category</th>
            <th>t CO2e</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={26} className="excel-report-spine">
              GHG Protocol Standards:
              <br />
              Corporate Scope - 1 and 2, Value Chain - Scope 3
            </td>
            <td rowSpan={6} className="excel-report-spine">
              Scope 1
            </td>
            <td rowSpan={3}>
              Direct emissions arising from owned or controlled stationary sources that use fossil fuels and/or emit
              fugitive emissions
            </td>
            <td>Fuels</td>
            <Value amount={tonnes("fuels")} />
          </tr>
          <tr>
            <td>Bioenergy</td>
            <Value amount={tonnes("bioenergy")} />
          </tr>
          <tr>
            <td>Refrigerants</td>
            <Value amount={tonnes("refrigerants")} />
          </tr>
          <tr>
            <td rowSpan={2}>Direct emissions from owned or controlled mobile sources</td>
            <td>Passenger vehicles</td>
            <Value amount={tonnes("passengerVehicles")} />
          </tr>
          <tr>
            <td>Delivery vehicles</td>
            <Value amount={tonnes("deliveryVehicles")} />
          </tr>
          <tr>
            <td colSpan={2} className="excel-report-subtotal">
              Total Scope 1
            </td>
            <Value amount={report.scope1tCO2e} />
          </tr>

          <tr>
            <td rowSpan={5} className="excel-report-spine">
              Scope 2
            </td>
            <td rowSpan={4} className="excel-report-group-center">
              Location-based emissions from the generation of purchased electricity, heat, steam or cooling
            </td>
            <td>Electricity</td>
            <Value amount={tonnes("electricity")} />
          </tr>
          <tr>
            <td>Heat and steam</td>
            <Value amount={tonnes("heatSteam")} />
          </tr>
          <tr>
            <td>Electricity for Evs</td>
            <Value amount={tonnes("electricityForEvs")} />
          </tr>
          <tr>
            <td>District cooling</td>
            <Value amount={tonnes("districtCooling")} />
          </tr>
          <tr>
            <td colSpan={2} className="excel-report-subtotal">
              Total Scope 2
            </td>
            <Value amount={report.scope2tCO2e} />
          </tr>

          <tr>
            <td rowSpan={15} className="excel-report-spine">
              Scope 3
            </td>
            <td rowSpan={2}>Fuel- and energy-related activities</td>
            <td>All other fuel- and energy related activities</td>
            <Value amount={tonnes("wttFuels")} />
          </tr>
          <tr>
            <td>Transmission and distribution losses</td>
            <Value amount={tonnes("tdLosses")} />
          </tr>
          <tr>
            <td rowSpan={2}>Waste generated in operations</td>
            <td>Waste water</td>
            <Value amount={tonnes("wasteWater")} />
          </tr>
          <tr>
            <td>Waste</td>
            <Value amount={tonnes("waste")} />
          </tr>
          <tr>
            <td rowSpan={2}>Purchased goods</td>
            <td>Water supplied</td>
            <Value amount={tonnes("waterSupplied")} />
          </tr>
          <tr>
            <td>Material use</td>
            <Value amount={tonnes("materialUse")} />
          </tr>
          <tr>
            <td rowSpan={4}>Business travel</td>
            <td>All transportation by air</td>
            <Value amount={tonnes("flights")} />
          </tr>
          <tr>
            <td>Emissions arising from hotel accommodation associated with business travel</td>
            <Value amount={tonnes("hotels")} />
          </tr>
          <tr>
            <td>All transportation by sea</td>
            <Value amount={tonnes("seaTravel")} />
          </tr>
          <tr>
            <td>All transportation by land, public transport, rented/leased vehicle and taxi</td>
            <Value amount={tonnes("landTravel")} />
          </tr>
          <tr>
            <td>Upstream transportation and distribution</td>
            <td>Freighting goods</td>
            <Value amount={tonnes("freight")} />
          </tr>
          <tr>
            <td colSpan={2}>Employees commuting</td>
            <Value amount={tonnes("commuting")} />
          </tr>
          <tr>
            <td colSpan={2}>Food</td>
            <Value amount={tonnes("food")} />
          </tr>
          <tr>
            <td colSpan={2}>Home office</td>
            <Value amount={tonnes("homeOffice")} />
          </tr>
          <tr>
            <td colSpan={2} className="excel-report-subtotal">
              Total Scope 3
            </td>
            <Value amount={report.scope3tCO2e} />
          </tr>

          <tr className="excel-report-grand">
            <td colSpan={4}>Total Emissions</td>
            <Value amount={report.totaltCO2e} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
