import { resolveCosmosConfig } from "@/lib/cosmos-runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = resolveCosmosConfig();
  return Response.json(
    {
      ok: true,
      configured: config.configured,
      hasToken: config.hasToken,
      hasDedicatedEndpoint: config.hasDedicatedEndpoint,
      model: config.model,
      provider: config.provider,
      timeoutMs: config.timeoutMs,
      mode: config.configured ? "live" : "unconfigured",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
