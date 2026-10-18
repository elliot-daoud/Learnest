"use client";

import { deleteAccount } from "../actions";

export default function DeleteAccount() {
  return (
    <form
      action={deleteAccount}
      onSubmit={(e) => {
        if (!confirm("Supprimer définitivement ton compte, tes scores et tes signalements ? Cette action est irréversible.")) {
          e.preventDefault();
        }
      }}
    >
      <button className="min-h-11 rounded-lg border border-red-300 px-4 text-red-800 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950">
        Supprimer mon compte et mes données
      </button>
    </form>
  );
}
