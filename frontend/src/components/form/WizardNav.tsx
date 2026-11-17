import { Link } from "react-router-dom";

type Props = {
  backTo?: string;
  nextTo: string;
  nextLabel?: string;
};

export function WizardNav({ backTo, nextTo, nextLabel = "Continue" }: Props) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      {backTo ? (
        <Link to={backTo} className="btn-secondary">
          Back
        </Link>
      ) : (
        <span />
      )}
      <Link to={nextTo} className="btn-primary">
        {nextLabel}
      </Link>
    </div>
  );
}
