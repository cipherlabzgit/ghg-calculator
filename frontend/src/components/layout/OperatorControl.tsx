import { Link } from "react-router-dom";
import { useShowFactors } from "../../hooks/useShowFactors";

type Props = {
  tone?: "light" | "dark";
};

export function OperatorControl({ tone = "light" }: Props) {
  const { showFactors, lock } = useShowFactors();
  const className =
    tone === "dark"
      ? "text-[11px] text-emerald-200/40 hover:text-emerald-100"
      : "text-[11px] text-slate-300 hover:text-slate-500";

  if (showFactors) {
    return (
      <button type="button" className={className} onClick={lock}>
        Hide factors
      </button>
    );
  }

  return (
    <Link to="/operator" className={className}>
      Operator
    </Link>
  );
}
