export default function Employees({
  params,
}: {
  params: {
    employeeId: string;
  };
}) {
  return <h1>Details for Employee {params.employeeId}</h1>;
}
