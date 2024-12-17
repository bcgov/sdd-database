"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function NewEmployee() {

    const router = useRouter();

  const handleClick = () => {
    console.log("Validating new employee details");
    console.log("Saving new employee details to database");
    console.log("Success! New employee has been added!");

    router.push("/");
  };

  return (
    <>
      <Link href="/">Home Page</Link>
      <h1>Enter details for the new employee</h1>
      <button onClick={handleClick}>Add Employee</button>
    </>
  );
}
