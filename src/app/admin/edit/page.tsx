import { AdminEditPage } from "../../prototype-ui";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const { draft } = await searchParams;
  return <AdminEditPage draftIndex={Number(draft ?? 0)} />;
}
