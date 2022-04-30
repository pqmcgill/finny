import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { getSpendListItems } from "~/models/spend.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

type LoaderData = {
  spendListItems: Awaited<ReturnType<typeof getSpendListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const spendListItems = await getSpendListItems({ userId });
  return json<LoaderData>({ spendListItems });
};

export default function SpendsPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-50">
      <header className="flex items-center justify-between p-4 text-pink-400 bg-slate-50">
        <h1 className="text-3xl font-bold">
          <Link to=".">Spends</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-pink-400 rounded hover:bg-pink-500 active:bg-pink-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full px-16 bg-white">
        <div className="flex-1 h-full border-r w-80 bg-gray-50">
          <Outlet />

          <hr />

          {data.spendListItems.length === 0 ? (
            <p className="p-4">No spends yet</p>
          ) : (
            <ol>
              {data.spendListItems.map((spend) => (
                <li key={spend.id}>
                  <div className={`block border-b p-4 text-xl`}>
                    ${spend.amount.toFixed(2)} - {spend.memo}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
