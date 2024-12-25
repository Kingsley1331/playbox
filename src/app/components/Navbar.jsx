import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul className="flex flex-row gap-x-2">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/demos1">Demos</Link>
        </li>
        <li>
          <Link href="/lab">Lab</Link>
        </li>
        <li>
          <Link href="/play">Play</Link>
        </li>
      </ul>
    </nav>
  );
}
