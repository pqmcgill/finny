import { Link } from "@remix-run/react";

export default function SpendIndexPage() {
  return (
    <p>
      No spend selected. Select a spend on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new spend.
      </Link>
    </p>
  );
}
