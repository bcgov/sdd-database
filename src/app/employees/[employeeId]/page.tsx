import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: {
    employeeId: string;
  };
};

export const generateMetadata = ({ params }: Props): Metadata => {
  return {
    title: {
      absolute: `Employee ${params.employeeId}`,
    },
  };
};

export default function Employees({ params }: Props) {
  if (parseInt(params.employeeId) > 3) {
    notFound();
  }
  return <h1>Details for Employee {params.employeeId}</h1>;
}
