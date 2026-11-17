import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { WizardLayout } from "../components/layout/WizardLayout";
import { useWizardDraft } from "../hooks/useWizardDraft";
import { useCountries } from "../hooks/useCountries";
import { organisationSchema } from "../utils/schemas";
import { Tooltip } from "../components/ui/Tooltip";
import type { OrganisationDraft } from "../types";

export function OrganisationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const startedOver = Boolean((location.state as { startedOver?: boolean } | null)?.startedOver);
  const { draft, update, resetCount } = useWizardDraft();
  const { countries, loading, error } = useCountries();
  const form = useForm({
    resolver: zodResolver(organisationSchema),
    defaultValues: draft.organisation,
  });

  useEffect(() => {
    if (resetCount === 0) return;
    form.reset(draft.organisation);
    // Only wipe the form after an explicit Start over, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetCount]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      update((current) => ({
        ...current,
        organisation: {
          name: values.name ?? "",
          country: values.country ?? "",
          city: values.city ?? "",
          period: values.period ?? "",
          employees: values.employees ?? "",
        },
      }));
    });
    return () => subscription.unsubscribe();
  }, [form, update]);

  return (
    <WizardLayout
      currentPath="/organisation"
      title="Your organisation"
      intro="Please enter the data of your organisation in the white fields"
    >
      {startedOver ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          Ready for a new calculation. Previous answers on this device have been cleared.
        </div>
      ) : null}
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <form
        className="card grid gap-5 sm:grid-cols-2"
        onSubmit={form.handleSubmit((values: OrganisationDraft) => {
          update((current) => ({ ...current, organisation: values }));
          navigate("/sheet/fuels");
        })}
      >
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-slate-800">Name of the organisation</span>
          <input className="field" placeholder="e.g. Green Valley Ltd" {...form.register("name")} />
          {form.formState.errors.name ? (
            <span className="mt-1 block text-xs text-red-700">{form.formState.errors.name.message}</span>
          ) : null}
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-slate-800">
            Country of the organisation
            <Tooltip text="Used to estimate electricity. Choose the country where most of your energy is used." />
          </span>
          <select className="field" disabled={loading} {...form.register("country")}>
            <option value="">{loading ? "Loading countries…" : "Choose a country"}</option>
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {form.formState.errors.country ? (
            <span className="mt-1 block text-xs text-red-700">{form.formState.errors.country.message}</span>
          ) : null}
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-slate-800">City of the organisation</span>
          <input className="field" {...form.register("city")} />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-slate-800">Period of the report</span>
          <input className="field" placeholder="e.g. 2024" {...form.register("period")} />
          {form.formState.errors.period ? (
            <span className="mt-1 block text-xs text-red-700">{form.formState.errors.period.message}</span>
          ) : null}
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-slate-800">Number of employees</span>
          <input type="number" min={0} className="field" {...form.register("employees")} />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary">
            Continue
          </button>
        </div>
      </form>
    </WizardLayout>
  );
}
