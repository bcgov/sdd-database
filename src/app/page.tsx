import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>This is the Home Page!</h1>
      <Link href="/about">About</Link>
      <Link href="/employees/1">Employee 1</Link>
      <Link href="/employees/2">Employee 2</Link>
      <Link href="/employees/3">Employee 3</Link>
      <Link href="/employees/new">Add a new employee</Link>
    </>
  );
}
