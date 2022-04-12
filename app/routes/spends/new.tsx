import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { createSpend } from "~/models/spend.server";
import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    memo?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const memo = formData.get("memo");

  if (typeof memo !== "string" || memo.length === 0) {
    return json<ActionData>(
      { errors: { memo: "Memo is required" } },
      { status: 400 }
    );
  }

  const spend = await createSpend({
    memo,
    amount: 10.0,
    tags: ["foo", "bar"],
    userId,
  });

  return redirect(`/spends/${spend.id}`);
};

export default function NewSpendPage() {
  const actionData = useActionData() as ActionData;
  const memoRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.memo) {
      memoRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex flex-col w-full gap-1">
          <span>Memo: </span>
          <input
            ref={memoRef}
            name="memo"
            className="flex-1 px-3 text-lg leading-loose border-2 border-blue-500 rounded-md"
            aria-invalid={actionData?.errors?.memo ? true : undefined}
            aria-errormessage={
              actionData?.errors?.memo ? "memo-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.memo && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.memo}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
