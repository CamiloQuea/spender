"use client";

import React from "react";
import TransactionTypeTable from "./_components/transaction-type-table";
import { api } from "@/trpc/react";

const TransactionTypePage = () => {
  const types = api.transaction.type.getAll.useQuery();

  return (
    <div className="pt-2">
      <TransactionTypeTable types={types.data ?? []} />
    </div>
  );
};

export default TransactionTypePage;
