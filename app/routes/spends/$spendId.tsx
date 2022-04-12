import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { Spend } from "~/models/spend.server";
import { deleteSpend, getSpend } from "~/models/spend.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  spend: Spend;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.spendId, "spendId not found");

  const spend = await getSpend({ userId, id: params.spendId });
  if (!spend) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ spend });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.spendId, "spendId not found");

  await deleteSpend({ userId, id: params.spendId });

  return redirect("/spends");
};

export default function SpendDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.spend.memo}</h3>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
