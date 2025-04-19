"use client";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import capitalizeWords from "../utilities/capitalizeWords";
import { Fragment } from "react";

export default function BreadCrumb() {
  const pathName = usePathname();

  const pathNames = pathName.split("/");

  const homeOrPath = (path: string) => {
    return path ? capitalizeWords(path) : "Home";
  };

  const getLink = (end: number) => {
    const paths = pathNames.slice(0, end + 1);
    if (paths.length === 1) {
      return "/";
    }
    return paths.join("/");
  };

  return (
    <div className="flex items-center gap-2 font-medium">
      {pathNames.map((pathName, index) => (
        <Fragment key={homeOrPath(pathName) + "key"}>
          {index !== 0 && <ChevronRightIcon className="size-4" />}
          <Link
            href={getLink(index)}
            className={`text-neutral-500 ${
              index + 1 === pathNames.length && "!text-neutral-900"
            }`}
          >
            {pathName ? capitalizeWords(pathName.replaceAll("-", " ")) : "Home"}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
