import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteSpend, getSpendListItems } from "~/models/spend.server";
import { getUser, requireUserId } from "~/session.server";
import { useUser } from "~/utils";

type LoaderData = {
  spendListItems: Awaited<ReturnType<typeof getSpendListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const spendListItems = await getSpendListItems({ userId });
  return json<LoaderData>({ spendListItems });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  invariant(user, "invalid user token");
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "delete") {
    const id = values.id;
    invariant(typeof id === "string", "deleting a spend requires an ID");
    return await deleteSpend({ id, userId: user.id });
  }

  return null;
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
                  <div className={`flex justify-between border-b p-4 text-xl`}>
                    ${spend.amount.toFixed(2)} - {spend.memo}
                    <Form method="post">
                      <input type="hidden" name="id" value={spend.id} />
                      <button
                        type="submit"
                        aria-label="delete"
                        name="_action"
                        value="delete"
                      >
                        X
                      </button>
                    </Form>
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
