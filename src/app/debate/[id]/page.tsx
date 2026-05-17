import { DebateDetailPage } from "../../prototype-ui";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DebateDetailPage debateId={id} />;
}
