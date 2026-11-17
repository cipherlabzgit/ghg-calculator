import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Logo } from "../components/ui/Logo";

const STEPS = [
  {
    number: "1",
    title: "Tell us who you are",
    body: "Organisation name, country, and the year you are reporting.",
  },
  {
    number: "2",
    title: "Answer simple questions",
    body: "Fuel, electricity, travel, waste. If something does not apply, tick “We don’t have this” and move on.",
  },
  {
    number: "3",
    title: "See your total",
    body: "We add everything up and show your greenhouse gas emissions in tonnes.",
  },
];

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8f6]">
      <header className="home-hero relative overflow-hidden">
        <span className="home-hero-glow home-hero-glow-one" aria-hidden />
        <span className="home-hero-glow home-hero-glow-two" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 pb-28 pt-8 text-center">
          <div className="flex justify-center">
            <Logo light />
          </div>
          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">
            Free for any organisation
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-[1.15] text-white sm:text-6xl">
            Find out your greenhouse gas emissions
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-emerald-50">
            You do not need to be an expert. Use numbers from bills you already have. Skip any question
            that does not apply.
          </p>
          <Link
            to="/organisation"
            className="home-start mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold"
          >
            Start — it takes a few minutes
            <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl -mt-16 px-6 pb-12">
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.number} className="home-step rounded-3xl p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-base font-semibold text-white">
                {step.number}
              </span>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </div>
  );
}
