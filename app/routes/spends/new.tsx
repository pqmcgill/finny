import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import * as React from "react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { createSpend } from "~/models/spend.server";
import { requireUserId } from "~/session.server";

type Errors = {
  memo?: string;
  amount?: string;
};

type ActionData = {
  errors?: Errors;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const memo = formData.get("memo");
  const amount = formData.get("amount");

  const errors: Errors = {};

  if (typeof memo !== "string" || memo.length === 0) {
    errors.memo = "Memo is required";
  }

  if (typeof amount !== "string" || parseFloat(amount) < 0.01) {
    errors.amount = "Amount is required";
  }

  if (Object.keys(errors).length) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  invariant(typeof memo === "string");
  invariant(typeof amount === "string");

  await createSpend({
    memo,
    amount: parseFloat(amount),
    tags: ["foo", "bar"],
    userId,
  });

  return redirect(`/spends/new`);
};

export default function NewSpendPage() {
  const actionData = useActionData() as ActionData;
  const transition = useTransition();

  const isAdding = transition.state === "submitting";

  const formRef = useRef<HTMLFormElement>(null);
  const memoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      memoRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (actionData?.errors?.memo) {
      memoRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      ref={formRef}
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex flex-col w-full gap-1 mb-2">
          <span>Memo: </span>
          <input
            ref={memoRef}
            name="memo"
            className="flex-1 px-3 text-lg leading-loose border-2 border-pink-200 rounded-md focus:outline-pink-400"
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
        <label className="flex flex-col w-full gap-1">
          <span>Amount: </span>
          <input
            name="amount"
            type="number"
            step="0.01"
            className="flex-1 px-3 text-lg leading-loose border-2 border-pink-200 rounded-md focus:outline-pink-400"
            aria-invalid={actionData?.errors?.amount ? true : undefined}
            aria-errormessage={
              actionData?.errors?.amount ? "amount-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.amount && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.amount}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-pink-400 rounded hover:bg-pink-600 focus:bg-pink-500 focus:outline-none disabled:bg-slate-400"
          disabled={isAdding}
        >
          Save
        </button>
      </div>
    </Form>
  );
}
