import { Link } from "@remix-run/react";

export default function SpendIndexPage() {
  return (
    <Link to="new" className="block p-4 text-xl text-blue-500">
      + New Spend
    </Link>
  );
}
