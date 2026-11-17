import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useShowFactors } from "../hooks/useShowFactors";

export function OperatorPage() {
  const { showFactors, unlock, lock } = useShowFactors();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const ok = unlock(pin);
    setPin("");
    setError(ok ? "" : "That PIN is not recognised.");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8f6]">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">Operator</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Emission factors</h1>
        {showFactors ? (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm leading-relaxed text-slate-700">
              Factor columns are visible on this device. End customers should not use this PIN.
            </p>
            <button type="button" className="btn-secondary mt-5" onClick={lock}>
              Hide factors
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <label className="text-sm font-medium text-slate-800">
              PIN
              <input
                className="field mt-1"
                type="password"
                autoComplete="off"
                value={pin}
                onChange={(event) => {
                  setPin(event.target.value);
                  setError("");
                }}
              />
            </label>
            {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
            <button type="submit" className="btn-primary mt-5">
              Show factors
            </button>
          </form>
        )}
        <Link to="/" className="mt-6 text-sm font-medium text-brand-800 underline">
          Back to calculator
        </Link>
      </main>
    </div>
  );
}
