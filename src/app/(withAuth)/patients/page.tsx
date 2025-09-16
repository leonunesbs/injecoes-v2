import Link from "next/link";
import { api } from "~/trpc/server";

export default async function PatientsPage() {
  const { patients } = await api.patient.getAll({ limit: 50 });

  if (!patients || patients.length === 0) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-muted-foreground">Nenhum paciente encontrado.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <ul className="divide-y">
        {patients.map((patient) => (
          <li key={patient.id} className="hover:bg-muted/30 px-4 py-3">
            <Link
              href={`/patients/${patient.id}`}
              className="flex flex-col gap-1 hover:underline"
            >
              <span className="font-medium">{patient.name}</span>
              <span className="text-muted-foreground text-sm">
                Prontuário: {patient.refId}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
