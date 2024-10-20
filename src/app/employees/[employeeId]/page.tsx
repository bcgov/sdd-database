import { notFound } from "next/navigation";

export default function Employees({
  params,
}: {
  params: {
    employeeId: string;
  };
}) {
  if (parseInt(params.employeeId) > 3) {
    notFound();
  }
  return <h1>Details for Employee {params.employeeId}</h1>;
}
