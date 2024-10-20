export default function EmployeeDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <h2>Details</h2>
    </>
  );
}
