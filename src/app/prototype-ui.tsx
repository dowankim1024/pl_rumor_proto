"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  adminQueue,
  clubOptions,
  debateThreads,
  issues,
  playerOptions,
  type Comment,
  type DebateThread,
  type Issue,
  type IssueType,
  type VoteSide,
} from "./prototype-data";

type RouteKey = "home" | "reels" | "feed" | "my-feed" | "debate" | "profile" | "onboarding";

const bottomNav: Array<{ key: RouteKey; href: string; label: string }> = [
  { key: "feed", href: "/feed", label: "Feed" },
  { key: "my-feed", href: "/my-feed", label: "My Team" },
  { key: "debate", href: "/debate", label: "Debate" },
  { key: "profile", href: "/profile", label: "Profile" },
];

const topNav: Array<{ key: RouteKey; href: string; label: string }> = [
  { key: "home", href: "/home", label: "Home" },
  { key: "feed", href: "/feed", label: "Feed" },
  { key: "reels", href: "/reels", label: "Reels" },
  { key: "debate", href: "/debate", label: "Debate" },
  { key: "my-feed", href: "/my-feed", label: "My Team" },
  { key: "profile", href: "/profile", label: "Profile" },
];

const defaultClubs = ["토트넘", "맨유"];
const defaultPlayers = ["손흥민", "브루노"];

export function HomePage() {
  return (
    <PublicShell active="home">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-6 lg:py-10">
        <div className="min-w-0">
          <div className="rounded-[8px] border border-[#273244] bg-[#111827] p-5 sm:p-7">
            <Badge tone="live">LIVE RUMOR HUB</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-[#F9FAFB] sm:text-6xl">
              프리미어리그 루머를 넘기고, 검증하고, 토론하세요
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#9CA3AF]">
              TIER ONE은 트위터/X의 공신력 있는 축구 기자 트윗을 가장 빠르게 수집해 이슈 카드, 투표, 대댓글 토론, 팀 맞춤 피드로 정리하는 PL 루머 피드입니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/reels">
                릴스 피드 보기
              </Link>
              <Link className="btn-secondary" href="/feed">
                전체 피드
              </Link>
              <Link className="btn-secondary" href="/debate">
                누적 토론
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard label="Live cards" value={String(issues.length)} />
            <MetricCard label="Debate rooms" value={String(debateThreads.length)} />
            <MetricCard label="Fan comments" value={String(issues.reduce((sum, issue) => sum + countComments(issue.comments), 0))} />
          </div>

          <section className="mt-6">
            <SectionHeader title="지금 뜨는 이슈" actionHref="/feed" actionLabel="전체 보기" />
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {issues.slice(0, 4).map((issue) => (
                <IssueCard key={issue.id} issue={issue} compact />
              ))}
            </div>
          </section>
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-20 lg:self-start">
          <SidePanel title="빠른 이동">
            <div className="grid gap-2">
              <Link className="side-link bg-[#7C3AED] text-white" href="/reels">
                모바일 릴스 피드
              </Link>
              <Link className="side-link" href="/onboarding">
                팀 선택하고 맞춤 피드 만들기
              </Link>
              <Link className="side-link" href="/profile">
                내 프로필과 배지
              </Link>
            </div>
          </SidePanel>
          <DebateDigest />
        </aside>
      </section>
    </PublicShell>
  );
}

export function ReelsPage() {
  const [activeIssueId, setActiveIssueId] = useState(issues[0].id);
  const [votes, setVotes] = useState<Record<string, VoteSide>>({});
  const horizontalRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const openComments = (issue: Issue) => {
    horizontalRefs.current[issue.id]?.scrollTo({
      left: horizontalRefs.current[issue.id]?.clientWidth ?? 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="h-dvh overflow-hidden bg-[#080A12] text-[#F9FAFB]">
      <section
        className="h-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
        onScroll={(event) => {
          const scroller = event.currentTarget;
          const index = Math.round(scroller.scrollTop / scroller.clientHeight);
          const issue = issues[Math.min(Math.max(index, 0), issues.length - 1)];
          if (issue && issue.id !== activeIssueId) {
            setActiveIssueId(issue.id);
          }
        }}
        style={{ touchAction: "pan-y" }}
      >
        {issues.map((issue) => (
          <div key={issue.id} className="h-dvh snap-start snap-always overflow-hidden">
            <div
              ref={(node) => {
                horizontalRefs.current[issue.id] = node;
              }}
              className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
              style={{ touchAction: "pan-x pan-y" }}
            >
              <ReelScreen
                issue={issue}
                vote={votes[issue.id]}
                onVote={(side) => setVotes((current) => ({ ...current, [issue.id]: side }))}
                onOpenComments={() => openComments(issue)}
              />
              <div className="h-full w-full shrink-0 snap-start bg-[#111827] md:w-[420px]">
                <ShortsCommentPanel issue={issue} />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function ReelScreen({
  issue,
  vote,
  onVote,
  onOpenComments,
}: {
  issue: Issue;
  vote?: VoteSide;
  onVote: (side: VoteSide) => void;
  onOpenComments: () => void;
}) {
  return (
    <article className="relative flex h-full w-full shrink-0 snap-start flex-col justify-between overflow-hidden bg-[#080A12] px-5 py-5 text-[#F9FAFB] md:px-10 lg:px-[10vw]">
      <img
        alt={issue.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        src={issue.image}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080A12]/50 via-[#080A12]/55 to-[#080A12]/95" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#7C3AED]/25 to-transparent" />
      <div className="relative flex items-center justify-between">
        <BrandMini />
        <Link className="rounded-full bg-[#1F2937] px-4 py-2 text-sm font-black" href="/home">
          홈
        </Link>
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="mb-4 flex items-center gap-2">
          <Badge tone={issue.type}>{issue.type === "forum" ? "LIVE" : issue.type === "poll" ? "POLL" : issue.tier}</Badge>
          <span className="text-xs font-bold text-[#9CA3AF]">{issue.source}</span>
        </div>
        <div className="rounded-[8px] border border-[#273244] bg-[#111827]/90 p-5 shadow-2xl backdrop-blur sm:p-7">
          <h1 className="text-3xl font-black leading-tight sm:text-5xl">{issue.title}</h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#9CA3AF] sm:text-base">{issue.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Tag>{issue.status}</Tag>
            {issue.tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          {issue.votes ? (
            <div className="mt-6">
              <VotingBox issue={issue} selected={vote} onVote={onVote} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl items-end justify-between gap-3 pb-16 md:pb-0">
        <div>
          <p className="text-sm font-bold text-[#9CA3AF]">
            {countComments(issue.comments)} comments · {issue.saves.toLocaleString("ko-KR")} saves
          </p>
          <p className="mt-1 text-xs font-semibold text-[#9CA3AF]">오른쪽으로 스와이프하면 댓글창</p>
        </div>
        <div className="grid gap-2">
          <button className="action-pill" onClick={onOpenComments} type="button">
            댓글
          </button>
          {issue.type === "forum" ? (
            <Link className="action-pill bg-[#A3E635] text-[#080A12]" href={`/debate/${issue.id}`}>
              토론
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function FeedPage({ personalized = false }: { personalized?: boolean }) {
  const list = personalized
    ? issues.filter(
      (issue) =>
        issue.clubs.some((club) => defaultClubs.includes(club)) ||
        issue.players.some((player) => defaultPlayers.includes(player)),
    )
    : issues;

  return (
    <PublicShell active={personalized ? "my-feed" : "feed"}>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[220px_minmax(0,1fr)_320px] lg:px-6">
        <aside className="hidden lg:block">
          <FilterPanel personalized={personalized} />
        </aside>
        <main className="min-w-0">
          <SectionHeader
            title={personalized ? "My Team Feed" : "전체 피드"}
            description={personalized ? "선택한 팀과 선수 중심으로 정리된 루머입니다." : "루머, 투표, 토론 카드를 최신순으로 확인하세요."}
          />
          <div className="mt-4 grid gap-4">
            {list.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </main>
        <aside className="hidden xl:grid xl:content-start xl:gap-4">
          <DebateDigest />
          <SidePanel title="내 관심 팀">
            <div className="flex flex-wrap gap-2">
              {defaultClubs.concat(defaultPlayers).map((item) => (
                <span key={item} className="rounded-full bg-[#1F2937] px-3 py-2 text-sm font-bold text-[#F9FAFB]">
                  {item}
                </span>
              ))}
            </div>
          </SidePanel>
        </aside>
      </section>
    </PublicShell>
  );
}

export function OnboardingPage() {
  const [selectedClubs, setSelectedClubs] = useState(defaultClubs);
  const [selectedPlayers, setSelectedPlayers] = useState(defaultPlayers);

  const completeOnboarding = () => {
    window.localStorage.setItem(
      "tier-one-preferences",
      JSON.stringify({ clubs: selectedClubs, players: selectedPlayers }),
    );
    window.location.href = "/home";
  };

  return (
    <main className="min-h-screen bg-[#080A12] px-4 py-6 text-[#F9FAFB] lg:px-6">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <main className="rounded-[8px] border border-[#273244] bg-[#111827] p-5 sm:p-8">
          <BrandMini />
          <div className="mt-10 max-w-3xl">
            <Badge tone="tier1">FIRST SETUP</Badge>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              좋아하는 팀과 선수를 먼저 알려주세요
            </h1>
            <p className="mt-4 text-base font-semibold leading-7 text-[#9CA3AF]">
              선택한 팀과 선수는 My Team Feed, 알림, 토론 추천의 기준이 됩니다. 처음에는 관심사를 좁혀두고, 이후 프로필에서 언제든 바꿀 수 있는 흐름입니다.
            </p>
          </div>

          <section className="mt-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">응원하는 팀</h2>
                <p className="mt-1 text-sm font-semibold text-[#9CA3AF]">최대 3개까지 선택하세요.</p>
              </div>
              <span className="text-sm font-black text-[#A3E635]">{selectedClubs.length}/3</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {clubOptions.concat(["풀럼", "울버햄튼", "웨스트햄", "에버턴"]).slice(0, 12).map((club, index) => {
                const active = selectedClubs.includes(club);
                return (
                  <button
                    key={club}
                    className={`min-h-[88px] rounded-[6px] border px-4 text-left font-black transition ${active
                        ? "border-[#7C3AED] bg-[#7C3AED] text-white"
                        : index % 3 === 0
                          ? "border-[#374151] bg-[#4B1F2E] text-white"
                          : index % 3 === 1
                            ? "border-[#374151] bg-[#16425F] text-white"
                            : "border-[#374151] bg-[#1F2937] text-white"
                      }`}
                    onClick={() =>
                      setSelectedClubs((current) =>
                        active ? current.filter((item) => item !== club) : current.length >= 3 ? current : current.concat(club),
                      )
                    }
                    type="button"
                  >
                    <span className="block text-xs text-white/60">CLUB</span>
                    {club}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">관심 선수</h2>
                <p className="mt-1 text-sm font-semibold text-[#9CA3AF]">선수 루머와 토론을 더 빨리 볼 수 있습니다.</p>
              </div>
              <span className="text-sm font-black text-[#A3E635]">{selectedPlayers.length}/5</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {playerOptions.map((player) => {
                const active = selectedPlayers.includes(player);
                return (
                  <button
                    key={player}
                    className={`rounded-full border px-4 py-3 text-sm font-black transition ${active ? "border-[#A3E635] bg-[#A3E635] text-[#080A12]" : "border-[#374151] bg-[#1F2937] text-[#F9FAFB]"
                      }`}
                    onClick={() =>
                      setSelectedPlayers((current) =>
                        active ? current.filter((item) => item !== player) : current.length >= 5 ? current : current.concat(player),
                      )
                    }
                    type="button"
                  >
                    {player}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              className="inline-flex h-12 items-center rounded-[5px] bg-[#7C3AED] px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedClubs.length && !selectedPlayers.length}
              onClick={completeOnboarding}
              type="button"
            >
              선택 완료하고 홈으로
            </button>
            <Link className="btn-secondary" href="/home">
              나중에 선택
            </Link>
          </div>
        </main>

        <aside className="grid content-start gap-4">
          <SidePanel title="선택 요약">
            <div className="grid gap-4">
              <PreferenceGroup label="팀" values={selectedClubs} />
              <PreferenceGroup label="선수" values={selectedPlayers} />
            </div>
          </SidePanel>
          <SidePanel title="맞춤 피드 미리보기">
            <div className="grid gap-3">
              {issues
                .filter(
                  (issue) =>
                    issue.clubs.some((club) => selectedClubs.includes(club)) ||
                    issue.players.some((player) => selectedPlayers.includes(player)),
                )
                .slice(0, 3)
                .map((issue) => (
                  <div key={issue.id} className="rounded-[6px] bg-[#1F2937] p-4">
                    <img alt={issue.imageAlt} className="mb-3 h-28 w-full rounded-[4px] object-cover" src={issue.image} />
                    <Badge tone={issue.type === "normal" ? "tier1" : issue.type}>{issue.type === "forum" ? "LIVE" : issue.tier}</Badge>
                    <h3 className="mt-3 font-black leading-snug text-[#F9FAFB]">{issue.title}</h3>
                  </div>
                ))}
            </div>
          </SidePanel>
        </aside>
      </section>
    </main>
  );
}

export function DebatePage() {
  return (
    <PublicShell active="debate">
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-6">
        <main className="min-w-0">
          <SectionHeader title="진행 중인 토론" description="여러 토론을 누적해서 열어두고, 각 토론별 현황과 댓글 흐름을 확인합니다." />
          <div className="mt-4 grid gap-4">
            {debateThreads.map((thread) => (
              <Link key={thread.id} className="block rounded-[8px] border border-[#273244] bg-[#111827] p-5 hover:border-[#7C3AED]" href={`/debate/${thread.id}`}>
                <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                  <img
                    alt={issues.find((issue) => issue.id === thread.issueId)?.imageAlt ?? thread.title}
                    className="h-40 w-full rounded-[6px] object-cover md:h-full"
                    src={issues.find((issue) => issue.id === thread.issueId)?.image ?? issues[0].image}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="forum">{thread.status}</Badge>
                      <span className="text-sm font-bold text-[#9CA3AF]">{thread.openedAt}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-black leading-tight text-[#F9FAFB]">{thread.title}</h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#9CA3AF]">{thread.analysis.summary}</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <StatCard value={`${thread.votes.agree}%`} label="찬성" />
                      <StatCard value={`${thread.votes.disagree}%`} label="반대" />
                      <StatCard value={thread.participants.toLocaleString("ko-KR")} label="참여" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
        <aside className="grid content-start gap-4">
          <DebateDigest />
          <SidePanel title="토론 키워드">
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(debateThreads.flatMap((thread) => thread.analysis.keywords))).slice(0, 10).map((keyword) => (
                <span key={keyword} className="rounded-full bg-[#1F2937] px-3 py-2 text-sm font-bold text-[#F9FAFB]">
                  {keyword}
                </span>
              ))}
            </div>
          </SidePanel>
        </aside>
      </section>
    </PublicShell>
  );
}

export function DebateDetailPage({ debateId }: { debateId: string }) {
  const thread = debateThreads.find((debate) => debate.id === debateId) ?? debateThreads[0];
  const issue = issues.find((item) => item.id === thread.issueId) ?? issues[0];
  const [comment, setComment] = useState("");

  return (
    <PublicShell active="debate">
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-6">
        <main className="min-w-0 rounded-[8px] border border-[#273244] bg-[#111827] p-5 sm:p-7">
          <Link className="text-sm font-black text-[#A3E635]" href="/debate">
            &lt; 토론 목록
          </Link>
          <div className="mt-5 overflow-hidden rounded-[8px] border border-[#273244] bg-[#1F2937]">
            <img alt={issue.imageAlt} className="h-[220px] w-full object-cover sm:h-[320px]" src={issue.image} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge tone="live">LIVE</Badge>
            <Badge tone={issue.type === "normal" ? "tier1" : issue.type}>{issue.tier}</Badge>
            <span className="text-sm font-bold text-[#9CA3AF]">{issue.source}</span>
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight text-[#F9FAFB] sm:text-5xl">{thread.title}</h1>
          <p className="mt-4 text-base font-semibold leading-7 text-[#9CA3AF]">{issue.summary}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <InfoCard label="STAGE" value={issue.status} />
            <InfoCard label="TEAM" value={issue.clubs.join(", ")} />
            <InfoCard label="COMMENTS" value={String(countComments(thread.comments))} />
            <InfoCard label="SAVES" value={issue.saves.toLocaleString("ko-KR")} />
          </div>
          <AnalysisBox thread={thread} expanded />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <PointList title="찬성 근거" points={thread.analysis.agreePoints} tone="agree" />
            <PointList title="반대 근거" points={thread.analysis.disagreePoints} tone="disagree" />
          </div>
        </main>

        <aside className="flex min-h-[620px] flex-col rounded-[8px] border border-[#273244] bg-[#111827]">
          <div className="border-b border-[#273244] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#F9FAFB]">Debate Room</h2>
              <Badge tone="live">LIVE</Badge>
            </div>
            <p className="mt-1 text-sm text-[#9CA3AF]">{thread.participants.toLocaleString("ko-KR")}명 참여중</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {thread.comments.map((item) => (
              <CommentItem key={item.id} comment={item} dark />
            ))}
          </div>
          <div className="border-t border-[#273244] p-4">
            <input
              className="h-11 w-full rounded-[4px] bg-[#1F2937] px-4 text-sm font-semibold text-[#F9FAFB] outline-none"
              onChange={(event) => setComment(event.target.value)}
              placeholder="의견을 남겨주세요..."
              value={comment}
            />
          </div>
        </aside>
      </section>
    </PublicShell>
  );
}

export function ProfilePage() {
  return (
    <PublicShell active="profile">
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[8px] border border-[#273244] bg-[#111827] p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full bg-[#7C3AED] text-3xl font-black text-white">S</div>
            <div>
              <h1 className="text-2xl font-black text-[#F9FAFB]">SON_Fan_07</h1>
              <p className="text-sm font-semibold text-[#9CA3AF]">Tottenham Hotspur</p>
              <Badge tone="forum">팩트 폭격기</Badge>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <Stat value="47" label="댓글" />
            <Stat value="12" label="토론" />
            <Stat value="89" label="저장" />
          </div>
        </aside>
        <main className="min-w-0">
          <SectionHeader title="배지와 활동" description="팬 참여 기록을 기준으로 획득한 배지와 다음 목표를 보여줍니다." />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ["성지 예측러", "루머 적중 5회 이상", "#A3E635"],
              ["팩트 폭격기", "Best Comment 10회 달성", "#7C3AED"],
              ["전술 분석가", "토론 참여 20회 이상", "#38BDF8"],
              ["우리팀 수호자", "팀 피드 매일 접속 30일", "#EC4899"],
              ["반박 장인", "반대 의견 Best 5회", "#F97316"],
              ["토론왕", "토론 승리 10회", "#A855F7"],
            ].map(([name, desc, color]) => (
              <div key={name} className="rounded-[8px] border border-[#273244] bg-[#111827] p-5">
                <Hex color={color} large />
                <h3 className="mt-4 text-xl font-black text-[#F9FAFB]">{name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#9CA3AF]">{desc}</p>
              </div>
            ))}
          </div>
        </main>
      </section>
    </PublicShell>
  );
}

export function AdminPage() {
  return (
    <main className="min-h-screen bg-[#080A12] px-4 py-6 text-[#F9FAFB] lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-[#7C3AED]">Admin Dashboard</p>
            <h1 className="text-3xl font-black sm:text-5xl">Raw Post Inbox / Card News Editor</h1>
          </div>
          <span className="rounded-full bg-[#F97316] px-4 py-2 text-sm font-black text-[#080A12]">12 pending</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-[8px] border border-[#374151] bg-[#111827] p-5">
            <h2 className="border-b border-[#273244] pb-3 text-xl font-black">RAW POST INBOX</h2>
            <div className="mt-4 grid gap-3">
              {adminQueue.concat(adminQueue).slice(0, 4).map((draft, index) => (
                <div key={`${draft.raw}-${index}`} className="rounded-[8px] bg-[#1F2937] p-4">
                  <div className="flex justify-between gap-3">
                    <h3 className="font-black">@{["FabrizioRomano", "David_Ornstein", "JacobSteinberg", "MattLaw_DT"][index]}</h3>
                    <span className="text-sm text-[#9CA3AF]">{index ? `${index * 15}min ago` : "2min ago"}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{draft.raw}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="h-8 rounded-[3px] bg-[#A3E635] px-4 text-sm font-black text-[#080A12]" type="button">Accept</button>
                    <button className="h-8 rounded-[3px] bg-[#EF4444] px-4 text-sm font-black text-white" type="button">Reject</button>
                    <button className="h-8 rounded-[3px] bg-[#374151] px-4 text-sm text-[#9CA3AF]" type="button">Hold</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[8px] border border-[#374151] bg-[#111827] p-5">
            <h2 className="border-b border-[#273244] pb-3 text-xl font-black">CARD NEWS EDITOR</h2>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((slide) => (
                <div key={slide} className={`grid aspect-square place-items-center rounded-[8px] border border-[#374151] text-2xl font-black ${slide === 1 ? "bg-[#4C327E] text-[#A3E635]" : "bg-[#1F2937] text-[#374151]"}`}>
                  {slide}
                </div>
              ))}
            </div>
            <p className="mt-5 font-mono text-sm text-[#7C3AED]">SLIDE 1 - HOOK</p>
            <div className="mt-3 grid gap-3">
              <div className="rounded-[4px] bg-[#1F2937] p-3">손흥민, 토트넘 잔류 확정?</div>
              <div className="rounded-[4px] bg-[#1F2937] p-3 text-[#9CA3AF]">TIER 1 기자 파브리지오 로마노 발언</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="forum">HOT RUMOR</Badge>
              <Badge tone="tier1">TIER 1</Badge>
              <Badge tone="poll">DEBATE</Badge>
              <Badge tone="official">OFFICIAL</Badge>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export function AdminEditPage({ draftIndex }: { draftIndex: number }) {
  void draftIndex;
  return <AdminPage />;
}

export function AlertsPage() {
  return (
    <PublicShell active="feed">
      <section className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
        <SectionHeader title="Watch Alerts" description="관심 팀과 선수에 연결된 주요 업데이트입니다." />
        <div className="mt-4 grid gap-4">
          {issues.slice(0, 4).map((issue) => (
            <IssueCard key={issue.id} issue={issue} compact />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}

function PublicShell({ active, children }: { active: RouteKey; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#080A12] pb-20 text-[#F9FAFB] md:pb-0">
      <header className="sticky top-0 z-30 border-b border-[#273244] bg-[#080A12]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
          <BrandMini />
          <nav className="hidden items-center gap-1 md:flex">
            {topNav.map((item) => (
              <Link
                key={item.key}
                className={`rounded-full px-4 py-2 text-sm font-black ${active === item.key ? "bg-[#7C3AED] text-white" : "text-[#9CA3AF] hover:bg-[#111827] hover:text-[#F9FAFB]"
                  }`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="hidden rounded-full bg-[#A3E635] px-4 py-2 text-sm font-black text-[#080A12] sm:block" href="/reels">
            Reels
          </Link>
        </div>
      </header>
      {children}
      <BottomNav active={active} />
    </main>
  );
}

function IssueCard({ issue, compact = false }: { issue: Issue; compact?: boolean }) {
  const [selected, setSelected] = useState<VoteSide | undefined>();
  const href = issue.type === "forum" ? `/debate/${issue.id}` : "/reels";

  return (
    <article className="rounded-[8px] border border-[#273244] bg-[#111827] p-4 sm:p-5">
      <div className="mb-4 overflow-hidden rounded-[6px] bg-[#1F2937]">
        <img
          alt={issue.imageAlt}
          className={`w-full object-cover ${compact ? "h-40" : "h-52 sm:h-64"}`}
          src={issue.image}
        />
      </div>
      <Link href={href}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={issue.type === "normal" ? "tier1" : issue.type}>
              {issue.type === "poll" ? "POLL" : issue.type === "forum" ? "LIVE" : issue.tier}
            </Badge>
            <span className="text-xs font-bold text-[#9CA3AF]">{issue.source}</span>
          </div>
          <span className="text-xs font-bold text-[#9CA3AF]">{countComments(issue.comments)} 댓글</span>
        </div>
        <h2 className={`mt-3 font-black leading-tight text-[#F9FAFB] ${compact ? "text-xl" : "text-2xl sm:text-3xl"}`}>{issue.title}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#9CA3AF]">{issue.summary}</p>
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        {issue.tags.slice(0, compact ? 2 : 4).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <a className="mt-3 inline-flex text-xs font-bold text-[#9CA3AF]" href={issue.imageSource} rel="noreferrer" target="_blank">
        이미지 출처
      </a>
      {issue.votes ? (
        <div className="mt-5">
          <VotingBox issue={issue} selected={selected} onVote={setSelected} />
        </div>
      ) : null}
    </article>
  );
}

function FilterPanel({ personalized }: { personalized: boolean }) {
  return (
    <SidePanel title={personalized ? "My Team" : "필터"}>
      <div className="grid gap-2">
        {["전체", "HOT RUMOR", "TIER 1", "POLL", "LIVE"].map((item, index) => (
          <button key={item} className={`side-link text-left ${index === 0 ? "bg-[#7C3AED] text-white" : ""}`} type="button">
            {item}
          </button>
        ))}
      </div>
    </SidePanel>
  );
}

function DebateDigest() {
  const thread = debateThreads[0];
  return (
    <SidePanel title="가장 뜨거운 토론">
      <Badge tone="forum">{thread.status}</Badge>
      <h3 className="mt-3 text-xl font-black leading-tight text-[#F9FAFB]">{thread.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{thread.analysis.summary}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <StatCard value={`${thread.votes.agree}%`} label="찬성" />
        <StatCard value={`${thread.votes.disagree}%`} label="반대" />
      </div>
      <Link className="mt-4 inline-flex h-10 items-center rounded-[5px] bg-[#A3E635] px-4 text-sm font-black text-[#080A12]" href={`/debate/${thread.id}`}>
        토론 입장
      </Link>
    </SidePanel>
  );
}

function SidePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[8px] border border-[#273244] bg-[#111827] p-4">
      <h2 className="mb-4 text-lg font-black text-[#F9FAFB]">{title}</h2>
      {children}
    </section>
  );
}

function PreferenceGroup({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase text-[#7C3AED]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.length ? (
          values.map((value) => (
            <span key={value} className="rounded-full bg-[#1F2937] px-3 py-2 text-sm font-black text-[#F9FAFB]">
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm font-semibold text-[#9CA3AF]">아직 선택하지 않았습니다.</span>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, description, actionHref, actionLabel }: { title: string; description?: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-black text-[#F9FAFB] sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm font-semibold leading-6 text-[#9CA3AF]">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link className="rounded-full bg-[#1F2937] px-4 py-2 text-sm font-black text-[#F9FAFB]" href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function ShortsCommentPanel({ issue }: { issue: Issue }) {
  return (
    <div className="flex h-full flex-col bg-[#111827] text-[#F9FAFB]">
      <div className="border-b border-[#273244] p-4">
        <h2 className="text-lg font-black">Comments ({countComments(issue.comments)})</h2>
        <p className="text-sm text-[#9CA3AF]">Best comments and replies</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {issue.comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} dark />
        ))}
      </div>
      <input className="m-4 h-10 rounded-[4px] bg-[#1F2937] px-4 text-sm outline-none" placeholder="의견을 남겨주세요..." />
    </div>
  );
}

function CommentItem({ comment, dark = false, compact = false }: { comment: Comment; dark?: boolean; compact?: boolean }) {
  return (
    <div className={`${compact ? "rounded-[6px] p-3" : "py-3"} ${dark ? "text-[#F9FAFB]" : "text-[#111827]"}`}>
      <div className="flex items-start gap-3">
        <CommentAvatar club={comment.club} tone={comment.side ?? "tier1"} />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="min-w-0 truncate text-sm font-black">{comment.author}</span>
            <span className="shrink-0 text-xs text-[#9CA3AF]">{comment.age}</span>
          </div>
          <p className={`mt-1 break-words text-sm leading-6 ${dark ? "text-[#F9FAFB]" : "text-[#111827]"}`}>{comment.text}</p>
          <div className="mt-1 flex min-w-0 gap-3 text-xs font-bold text-[#9CA3AF]">
            <span className="shrink-0">{comment.likes} likes</span>
            <button type="button">Reply</button>
          </div>
          {comment.replies?.length ? (
            <div className="mt-2 border-l border-[#374151] pl-2 sm:pl-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} dark={dark} compact />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CommentAvatar({ club, tone }: { club: string; tone: VoteSide | "tier1" }) {
  const styles: Record<VoteSide | "tier1", string> = {
    agree: "bg-[#7C3AED] text-white",
    disagree: "bg-[#EF4444] text-white",
    tier1: "bg-[#1F2937] text-[#A3E635] ring-1 ring-[#374151]",
  };
  const label = club === "중립" ? "N" : club.slice(0, 1).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-black leading-none ${styles[tone]}`}
      title={club}
    >
      {label}
    </span>
  );
}

function AnalysisBox({ thread, expanded = false }: { thread: DebateThread; expanded?: boolean }) {
  return (
    <div className="mt-5 rounded-[8px] border border-[#7C3AED] bg-[#1F2937] p-4">
      <p className="font-mono text-xs text-[#7C3AED]">AI LIVE ANALYSIS</p>
      <p className="mt-2 text-sm font-bold text-[#F9FAFB]">찬성 {thread.votes.agree}% / 반대 {thread.votes.disagree}%</p>
      <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{thread.analysis.summary}</p>
      {expanded ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoCard label="TREND" value={thread.analysis.trend} />
          <InfoCard label="RISK" value={thread.analysis.risk} />
        </div>
      ) : null}
    </div>
  );
}

function VotingBox({ issue, selected, onVote }: { issue: Issue; selected?: VoteSide; onVote: (side: VoteSide) => void }) {
  if (!issue.votes) return null;

  if (!selected) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <button className="rounded-[6px] bg-[#3F7B1F] p-4 text-left text-sm font-black text-[#A3E635]" onClick={() => onVote("agree")} type="button">
          <span className="block text-lg">찬성</span>
          <span className="mt-2 block text-xs leading-5 text-[#F9FAFB]/80">{issue.agreeReason}</span>
        </button>
        <button className="rounded-[6px] bg-[#4B1F2E] p-4 text-left text-sm font-black text-[#EC4899]" onClick={() => onVote("disagree")} type="button">
          <span className="block text-lg">반대</span>
          <span className="mt-2 block text-xs leading-5 text-[#F9FAFB]/80">{issue.disagreeReason}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className={`poll-row ${selected === "agree" ? "ring-2 ring-[#A3E635]" : ""}`}>
        <span>찬성</span>
        <strong>{issue.votes.agree}%</strong>
      </div>
      <div className={`poll-row bg-[#4B1F2E] text-[#EC4899] ${selected === "disagree" ? "ring-2 ring-[#EC4899]" : ""}`}>
        <span>반대</span>
        <strong>{issue.votes.disagree}%</strong>
      </div>
      <p className="text-sm text-[#9CA3AF]">{issue.votes.total.toLocaleString("ko-KR")}명 참여</p>
    </div>
  );
}

function PointList({ title, points, tone }: { title: string; points: string[]; tone: VoteSide }) {
  return (
    <section className="rounded-[8px] border border-[#273244] bg-[#1F2937] p-4">
      <Badge tone={tone}>{title}</Badge>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#F9FAFB]">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}

function BottomNav({ active }: { active: RouteKey }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-4 border-t border-[#273244] bg-[#080A12] text-center text-xs text-[#9CA3AF] md:hidden">
      {bottomNav.map((item) => (
        <Link
          key={item.key}
          className={`flex flex-col items-center justify-center gap-1 ${active === item.key ? "text-[#F9FAFB]" : ""}`}
          href={item.href}
        >
          <span className={`size-1.5 rounded-full ${active === item.key ? "bg-[#A3E635]" : "bg-transparent"}`} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-[#273244] bg-[#111827] p-4">
      <p className="text-sm font-black text-[#7C3AED]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#F9FAFB]">{value}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[6px] bg-[#1F2937] p-3">
      <p className="text-xl font-black text-[#F9FAFB]">{value}</p>
      <p className="text-xs font-bold text-[#9CA3AF]">{label}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[6px] bg-[#1F2937] p-3">
      <p className="font-mono text-xs text-[#7C3AED]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#F9FAFB]">{value}</p>
    </div>
  );
}

function Badge({ tone, children }: { tone: IssueType | VoteSide | "tier1" | "official" | "live"; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    normal: "bg-[#9CA3AF] text-[#080A12]",
    poll: "bg-[#F97316] text-[#080A12]",
    forum: "bg-[#EC4899] text-[#080A12]",
    agree: "bg-[#7C3AED] text-white",
    disagree: "bg-[#EF4444] text-white",
    tier1: "bg-[#7C3AED] text-white",
    official: "bg-[#A3E635] text-[#080A12]",
    live: "bg-[#EF4444] text-white",
  };
  return (
    <span className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-black ${styles[tone]}`}>
      {children}
    </span>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[#1F2937] px-3 py-1 text-xs font-bold text-[#A855F7]">{children}</span>;
}

function BrandMini() {
  return (
    <Link className="flex items-center gap-2" href="/home">
      <span className="h-8 w-1 bg-[#A3E635]" />
      <span className="font-mono text-2xl font-black">TIER ONE</span>
    </Link>
  );
}

function Hex({ color, large = false }: { color: string; large?: boolean }) {
  return (
    <span
      className={`block ${large ? "size-14" : "size-8"}`}
      style={{ background: color, clipPath: "polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0 50%)" }}
    />
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-black text-[#F9FAFB]">{value}</p>
      <p className="text-sm text-[#9CA3AF]">{label}</p>
    </div>
  );
}

function countComments(comments: Comment[]): number {
  return comments.reduce((total, comment) => total + 1 + (comment.replies ? countComments(comment.replies) : 0), 0);
}
