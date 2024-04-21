"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateSpend() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);

  const createSpend = api.spend.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createSpend.mutate({ 
          name, 
          amount, 
          description
        });
      }}
      className="flex md:flex-row w-full flex-col  gap-2"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createSpend.isPending}
      >
        {createSpend.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
