import { redirect } from "next/navigation";

type SearchParams = Promise<{ service?: string }>;

export default async function BookingPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const service = params.service?.trim();
  redirect(service ? `/dashboard/slots?service=${encodeURIComponent(service)}` : "/dashboard/slots");
}
