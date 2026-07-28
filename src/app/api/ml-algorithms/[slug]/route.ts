import { NextResponse } from "next/server";
import { getMlAlgorithm } from "@/lib/ml-algorithms";

export function GET(_: Request, { params }: { params: { slug: string } }) {
  const algorithm = getMlAlgorithm(params.slug);
  if (!algorithm) {
    return NextResponse.json({ error: "Algorithm not found" }, { status: 404 });
  }
  return NextResponse.json(algorithm);
}
