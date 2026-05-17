"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  adminQueue,
  clubOptions,
  debateThreads,
  issues,
  playerOptions,
  statusCopy,
  type Comment,
  type DebateThread,
  type Issue,
  type IssueType,
  type RumorStatus,
  type VoteSide,
} from "./prototype-data";

type RouteKey =
  | "home"
  | "reels"
  | "feed"
  | "my-feed"
  | "debate"
  | "alerts"
  | "admin"
  | "onboarding";

const navItems: Array<{ key: RouteKey; href: string; label: string }> = [
  { key: "home", href: "/", label: "홈" },
  { key: "reels", href: "/reels", label: "릴스" },
  { key: "feed", href: "/feed", label: "전체 피드" },
  { key: "my-feed", href: "/my-feed", label: "마이 피드" },
  { key: "debate", href: "/debate", label: "누적 토론" },
  { key: "alerts", href: "/alerts", label: "알림" },
  { key: "admin", href: "/admin", label: "어드민" },
];

const defaultClubs = ["토트넘", "맨유"];
const defaultPlayers = ["손흥민", "브루노"];

export function AppShell({
  active,
  children,
  compact = false,
}: {
  active: RouteKey;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <main className="min-h-screen bg-[#f4f7f2] text-[#101714]">
      <header
        className={`sticky top-0 z-30 border-b border-[#dce5d8] bg-white/95 backdrop-blur ${
          compact ? "hidden sm:block" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#164a32] text-sm font-black text-white">
              PL
            </span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.22em] text-[#cc3b2f]">
                Rumor Feed
              </span>
              <span className="text-xl font-black">프리미어리그 이슈 피드</span>
            </span>
          </Link>
          <nav className="flex gap-1 overflow-x-auto rounded-[8px] bg-[#eef3ea] p-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                className={`flex h-10 shrink-0 items-center rounded-[6px] px-3 text-sm font-bold ${
                  active === item.key
                    ? "bg-[#101714] text-white"
                    : "text-[#4d5a4c] hover:bg-white"
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}

export function HomePage() {
  return (
    <AppShell active="home">
      <section className="mx-auto grid min-h-[calc(100vh-74px)] max-w-[1480px] gap-6 px-4 py-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#cc3b2f]">
            MVP Prototype
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight lg:text-7xl">
            넘기고, 밀고, 투표하는 PL 이슈 서비스
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#4d5a4c]">
            릴스에서는 모바일 쇼츠처럼 세로 스와이프로 이슈를 넘기고, 댓글 버튼
            또는 오른쪽 스와이프로 댓글창을 엽니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="flex h-12 items-center rounded-[6px] bg-[#cc3b2f] px-5 text-sm font-black text-white"
              href="/reels"
            >
              릴스 피드 보기
            </Link>
            <Link
              className="flex h-12 items-center rounded-[6px] bg-[#101714] px-5 text-sm font-black text-white"
              href="/feed"
            >
              전체 피드 보기
            </Link>
            <Link
              className="flex h-12 items-center rounded-[6px] border border-[#bfd0b8] px-5 text-sm font-black text-[#164a32]"
              href="/debate"
            >
              누적 토론 보기
            </Link>
          </div>
        </div>

        <div className="grid gap-3">
          {[
            ["릴스형 피드", "스크롤/스와이프 + 쇼츠형 댓글", "/reels"],
            ["전체 피드", `${issues.length}개 이슈 데이터`, "/feed"],
            ["누적 토론", "여러 토론방 목록과 상세 분석", "/debate"],
            ["어드민", "수집 대기열과 게시 검수", "/admin"],
          ].map(([title, body, href]) => (
            <Link
              key={title}
              className="rounded-[8px] border border-[#dce5d8] bg-white p-5 shadow-sm hover:border-[#164a32]"
              href={href}
            >
              <span className="text-2xl font-black">{title}</span>
              <span className="mt-2 block text-sm font-bold text-[#5d6a5b]">{body}</span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export function ReelsPage() {
  const [activeIssueId, setActiveIssueId] = useState(issues[0].id);
  const [sheetIssue, setSheetIssue] = useState<Issue | null>(null);
  const [votes, setVotes] = useState<Record<string, VoteSide>>({});
  const activeIssue = issues.find((issue) => issue.id === activeIssueId) ?? issues[0];
  const activeIndex = issues.findIndex((issue) => issue.id === activeIssue.id);
  const horizontalRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const openMobileComments = (issue: Issue) => {
    setSheetIssue(issue);
    const scroller = horizontalRefs.current[issue.id];
    scroller?.scrollTo({ left: scroller.clientWidth, behavior: "smooth" });
  };

  return (
    <AppShell active="reels" compact>
      <div className="grid h-screen bg-[#101714] sm:h-[calc(100vh-74px)] lg:grid-cols-[minmax(0,1fr)_420px]">
        <section
          className="snap-y snap-mandatory overflow-y-auto scroll-smooth"
          onScroll={(event) => {
            const scroller = event.currentTarget;
            const index = Math.round(scroller.scrollTop / scroller.clientHeight);
            const issue = issues[Math.min(Math.max(index, 0), issues.length - 1)];
            if (issue && issue.id !== activeIssueId) {
              setActiveIssueId(issue.id);
              setSheetIssue(null);
            }
          }}
          style={{ touchAction: "pan-y" }}
        >
          {issues.map((issue, index) => (
            <div
              key={issue.id}
              className="h-screen snap-start snap-always overflow-hidden sm:h-[calc(100vh-74px)]"
            >
              <div
                ref={(node) => {
                  horizontalRefs.current[issue.id] = node;
                }}
                className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth lg:overflow-x-hidden"
                style={{ touchAction: "pan-x pan-y" }}
              >
                <ReelCard
                  issue={issue}
                  issueIndex={index}
                  totalIssues={issues.length}
                  vote={votes[issue.id]}
                  onVote={(side) => setVotes((current) => ({ ...current, [issue.id]: side }))}
                  onOpenComments={() => openMobileComments(issue)}
                />
                <div className="h-full w-full shrink-0 snap-start bg-white lg:hidden">
                  <ShortsCommentPanel issue={issue} />
                </div>
              </div>
            </div>
          ))}
        </section>
        <aside className="hidden overflow-y-auto border-l border-white/15 bg-white lg:block">
          <ShortsCommentPanel issue={activeIssue} />
        </aside>

        <div className="pointer-events-none fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 text-center text-xs font-black text-white/80 sm:flex lg:left-[calc(100%-458px)] lg:right-auto">
          <span className="rounded-[6px] bg-black/40 px-2 py-1">
            {activeIndex + 1}/{issues.length}
          </span>
          <span className="rounded-[6px] bg-black/40 px-2 py-1">스크롤</span>
        </div>

        {sheetIssue ? (
          <div className="fixed inset-x-0 bottom-0 z-40 max-h-[78vh] overflow-hidden rounded-t-[14px] bg-white shadow-2xl lg:hidden">
            <ShortsCommentPanel issue={sheetIssue} onClose={() => setSheetIssue(null)} />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function ReelCard({
  issue,
  issueIndex,
  totalIssues,
  vote,
  onVote,
  onOpenComments,
}: {
  issue: Issue;
  issueIndex: number;
  totalIssues: number;
  vote?: VoteSide;
  onVote: (side: VoteSide) => void;
  onOpenComments: () => void;
}) {
  return (
    <article className="relative flex h-full w-full shrink-0 snap-start flex-col justify-between overflow-hidden px-5 py-6 sm:px-9">
      <div className={`absolute inset-0 bg-gradient-to-br ${issue.tone}`} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,23,20,.08)_1px,transparent_1px),linear-gradient(0deg,rgba(16,23,20,.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="relative flex items-start justify-between">
        <IssueBadge type={issue.type} />
        <span className="rounded-[6px] bg-white/85 px-3 py-2 text-xs font-black">
          {issueIndex + 1} / {totalIssues}
        </span>
      </div>
      <div className="relative max-w-4xl">
        <div className="mb-5 flex flex-wrap gap-2">
          <StatusPill status={issue.status} />
          <span className="rounded-[6px] bg-white/85 px-3 py-1 text-xs font-black">
            {issue.tier}
          </span>
          <span className="rounded-[6px] bg-white/85 px-3 py-1 text-xs font-black">
            출처 {issue.source}
          </span>
        </div>
        <h2 className="max-w-4xl text-balance text-4xl font-black leading-tight sm:text-6xl">
          {issue.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-[#263226]">
          {issue.summary}
        </p>
        {issue.type !== "normal" && issue.votes ? (
          <div className="mt-6 grid max-w-3xl gap-3 md:grid-cols-[1fr_1fr]">
            <Argument label="찬성 근거" text={issue.agreeReason ?? ""} side="agree" />
            <Argument label="반대 근거" text={issue.disagreeReason ?? ""} side="disagree" />
            <div className="rounded-[8px] bg-white/90 p-4 md:col-span-2">
              <VotingBox issue={issue} selected={vote} onVote={onVote} />
            </div>
          </div>
        ) : null}
      </div>
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {issue.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[6px] bg-[#101714]/80 px-3 py-1 text-sm font-bold text-white"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="h-12 rounded-[6px] bg-[#101714] px-5 text-sm font-black text-white"
            onClick={onOpenComments}
            type="button"
          >
            댓글 {countComments(issue.comments)}
          </button>
          {issue.type === "forum" ? (
            <Link
              className="flex h-12 items-center rounded-[6px] bg-[#cc3b2f] px-5 text-sm font-black text-white"
              href={`/debate/${issue.id}`}
            >
              토론 들어가기
            </Link>
          ) : null}
          <Metric label="저장" value={issue.saves.toLocaleString("ko-KR")} />
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
    <AppShell active={personalized ? "my-feed" : "feed"}>
      <section className="mx-auto max-w-[1480px] px-4 py-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cc3b2f]">
              {personalized ? "My Feed" : "Issue Feed"}
            </p>
            <h1 className="mt-2 text-4xl font-black">
              {personalized ? "마이 피드" : "전체 피드"}
            </h1>
            <p className="mt-2 text-sm font-bold text-[#5d6a5b]">
              {list.length}개 이슈 · 댓글/대댓글/투표 상태 포함
            </p>
          </div>
          <Link
            className="flex h-11 w-fit items-center rounded-[6px] bg-[#cc3b2f] px-4 text-sm font-black text-white"
            href="/reels"
          >
            릴스 형식으로 보기
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((issue) => (
            <IssueListCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export function OnboardingPage() {
  return (
    <AppShell active="onboarding">
      <section className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cc3b2f]">
          Onboarding
        </p>
        <h1 className="mt-2 text-4xl font-black">관심 클럽과 선수를 선택</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PreferenceBlock title="관심 클럽" options={clubOptions} selected={defaultClubs} />
          <PreferenceBlock title="관심 선수" options={playerOptions} selected={defaultPlayers} />
        </div>
        <Link
          className="mt-6 flex h-12 w-fit items-center rounded-[6px] bg-[#101714] px-5 text-sm font-black text-white"
          href="/my-feed"
        >
          마이 피드로 이동
        </Link>
      </section>
    </AppShell>
  );
}

export function DebatePage() {
  return (
    <AppShell active="debate">
      <section className="mx-auto max-w-[1480px] px-4 py-6">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cc3b2f]">
            Debate Hub
          </p>
          <h1 className="mt-2 text-4xl font-black">누적 토론</h1>
          <p className="mt-2 text-sm font-bold text-[#5d6a5b]">
            토론은 하루 단위로 닫히지 않고, 반응이 살아 있는 주제들이 누적됩니다.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {debateThreads.map((thread) => (
            <DebateCard key={thread.id} thread={thread} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export function DebateDetailPage({ debateId }: { debateId: string }) {
  const thread = debateThreads.find((debate) => debate.id === debateId) ?? debateThreads[0];
  const issue = issues.find((item) => item.id === thread.issueId) ?? issues[0];
  const [stance, setStance] = useState<VoteSide>("disagree");
  const [comment, setComment] = useState("");

  return (
    <AppShell active="debate">
      <section className="mx-auto grid max-w-[1480px] gap-4 px-4 py-6 lg:grid-cols-[1fr_420px]">
        <div className="overflow-hidden rounded-[8px] border border-[#dce5d8] bg-white">
          <header className="bg-[#101714] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f0c46a]">
              Live Debate
            </p>
            <h1 className="mt-2 text-3xl font-black">{thread.title}</h1>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/75">
              {issue.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Metric label="상태" value={thread.status} inverted />
              <Metric label="참여자" value={thread.participants.toLocaleString("ko-KR")} inverted />
              <Metric label="열림" value={thread.openedAt} inverted />
            </div>
          </header>
          <div className="grid gap-3 p-4">
            {thread.comments.map((item) => (
              <CommentItem key={item.id} comment={item} />
            ))}
          </div>
          <footer className="border-t border-[#e2e8dd] p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="grid grid-cols-2 gap-2 md:w-48">
                {(["agree", "disagree"] as const).map((side) => (
                  <button
                    key={side}
                    className={`h-11 rounded-[6px] text-sm font-black ${
                      stance === side
                        ? side === "agree"
                          ? "bg-[#1769aa] text-white"
                          : "bg-[#c5382c] text-white"
                        : "bg-[#eef3ea]"
                    }`}
                    onClick={() => setStance(side)}
                    type="button"
                  >
                    {side === "agree" ? "찬성" : "반대"}
                  </button>
                ))}
              </div>
              <input
                className="h-11 min-w-0 flex-1 rounded-[6px] border border-[#cfdcca] px-3 text-sm font-semibold"
                onChange={(event) => setComment(event.target.value)}
                placeholder="의견 또는 대댓글 입력"
                value={comment}
              />
              <button className="h-11 rounded-[6px] bg-[#164a32] px-5 text-sm font-black text-white" type="button">
                등록
              </button>
            </div>
          </footer>
        </div>
        <DetailedAnalysis thread={thread} />
      </section>
    </AppShell>
  );
}

export function AlertsPage() {
  return (
    <AppShell active="alerts">
      <section className="mx-auto max-w-5xl px-4 py-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cc3b2f]">
          Push Rules
        </p>
        <h1 className="mt-2 text-4xl font-black">알림</h1>
        <div className="mt-6 grid gap-3">
          {[
            ["토트넘 이슈", "손흥민 관련 현지 루머가 업데이트됐습니다.", "Tier 2 · Monitoring"],
            ["누적 토론", "손흥민 거취 토론이 1만 명을 넘었습니다.", "LIVE · 12,842명"],
            ["맨유 이슈", "브루노 매각 논쟁 투표가 반대 62%로 기울었습니다.", "Poll · Contact"],
            ["아스날 이슈", "공격수 영입 필요성 투표가 상승 중입니다.", "Interest · Tier 2"],
          ].map(([title, body, meta]) => (
            <div key={title} className="rounded-[8px] border border-[#dce5d8] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-black">{title}</h2>
                <span className="rounded-[6px] bg-[#eef3ea] px-2 py-1 text-xs font-black text-[#cc3b2f]">
                  {meta}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#4d5a4c]">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export function AdminPage() {
  return (
    <AppShell active="admin">
      <section className="mx-auto grid max-w-[1480px] gap-4 px-4 py-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-[8px] border border-[#dce5d8] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cc3b2f]">
            Admin Queue
          </p>
          <h1 className="mt-2 text-3xl font-black">검수 대기열</h1>
          <div className="mt-5 grid gap-2">
            {adminQueue.map((draft, index) => (
              <Link
                key={draft.raw}
                className="rounded-[8px] border border-[#dce5d8] bg-[#f8faf6] p-3 hover:border-[#164a32]"
                href={`/admin/edit?draft=${index}`}
              >
                <span className="text-xs font-black text-[#cc3b2f]">{draft.source}</span>
                <span className="mt-1 block text-sm font-black">{draft.suggestion}</span>
                <span className="mt-2 block text-xs font-bold text-[#5d6a5b]">
                  {draft.status} · {draft.type}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <AdminEditor draftIndex={0} />
      </section>
    </AppShell>
  );
}

export function AdminEditPage({ draftIndex }: { draftIndex: number }) {
  return (
    <AppShell active="admin">
      <section className="mx-auto max-w-5xl px-4 py-6">
        <AdminEditor draftIndex={draftIndex} />
      </section>
    </AppShell>
  );
}

function IssueListCard({ issue }: { issue: Issue }) {
  const [vote, setVote] = useState<VoteSide | undefined>();

  return (
    <article className="rounded-[8px] border border-[#dce5d8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <IssueBadge type={issue.type} />
        <StatusPill status={issue.status} />
      </div>
      <h2 className="mt-4 text-2xl font-black">{issue.title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#4d5a4c]">{issue.summary}</p>
      {issue.votes ? (
        <div className="mt-4 rounded-[8px] bg-[#f8faf6] p-3">
          <VotingBox issue={issue} selected={vote} onVote={setVote} />
        </div>
      ) : null}
      <div className="mt-4">
        <CommentPreview comments={issue.comments} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {issue.tags.map((tag) => (
          <span key={tag} className="rounded-[6px] bg-[#eef3ea] px-2 py-1 text-xs font-black">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function ShortsCommentPanel({
  issue,
  onClose,
}: {
  issue: Issue;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full max-h-[78vh] flex-col bg-white lg:max-h-none">
      <div className="flex items-center justify-between border-b border-[#e2e8dd] px-4 py-3">
        <div>
          <h2 className="text-lg font-black">댓글 {countComments(issue.comments)}</h2>
          <p className="text-xs font-bold text-[#5d6a5b]">인기순 · 대댓글 포함</p>
        </div>
        {onClose ? (
          <button className="rounded-[6px] bg-[#eef3ea] px-3 py-2 text-sm font-black" onClick={onClose} type="button">
            닫기
          </button>
        ) : null}
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {["전체", "찬성", "반대", "인기 댓글"].map((chip) => (
          <button key={chip} className="h-8 shrink-0 rounded-full bg-[#eef3ea] px-3 text-xs font-black" type="button">
            {chip}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-24">
        {issue.comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
      <div className="border-t border-[#e2e8dd] bg-white p-3">
        <div className="flex gap-2">
          <input
            className="h-11 min-w-0 flex-1 rounded-full border border-[#cfdcca] px-4 text-sm font-semibold"
            placeholder="댓글 추가..."
          />
          <button className="h-11 rounded-full bg-[#101714] px-4 text-sm font-black text-white" type="button">
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentPreview({ comments }: { comments: Comment[] }) {
  return (
    <div className="rounded-[8px] border border-[#dce5d8] bg-[#f8faf6] p-3">
      <p className="text-xs font-black text-[#5d6a5b]">댓글 미리보기</p>
      {comments.slice(0, 2).map((comment) => (
        <CommentItem key={comment.id} comment={comment} compact />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  compact = false,
}: {
  comment: Comment;
  compact?: boolean;
}) {
  return (
    <div className={`${compact ? "mt-3" : "border-b border-[#edf1ea] py-4 last:border-b-0"}`}>
      <div className="flex gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#164a32] text-xs font-black text-white">
          {comment.author.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-black">@{comment.author}</span>
            <span className="text-xs font-bold text-[#7a8477]">{comment.club}</span>
            <span className="text-xs font-bold text-[#7a8477]">{comment.age}</span>
            {comment.side ? (
              <span
                className={`rounded-[6px] px-2 py-0.5 text-[11px] font-black text-white ${
                  comment.side === "agree" ? "bg-[#1769aa]" : "bg-[#c5382c]"
                }`}
              >
                {comment.side === "agree" ? "찬성" : "반대"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#1f2a1e]">{comment.text}</p>
          <div className="mt-2 flex gap-4 text-xs font-black text-[#6a7468]">
            <span>좋아요 {comment.likes}</span>
            <button type="button">답글</button>
          </div>
          {!compact && comment.replies?.length ? (
            <div className="mt-3 border-l-2 border-[#dce5d8] pl-3">
              <button className="mb-2 text-xs font-black text-[#1769aa]" type="button">
                답글 {comment.replies.length}개 보기
              </button>
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} compact />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DebateCard({ thread }: { thread: DebateThread }) {
  return (
    <Link
      className="rounded-[8px] border border-[#dce5d8] bg-white p-5 shadow-sm hover:border-[#164a32]"
      href={`/debate/${thread.id}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-[6px] bg-[#f0c46a] px-2 py-1 text-xs font-black">
          {thread.status}
        </span>
        <span className="text-xs font-bold text-[#5d6a5b]">{thread.openedAt}</span>
      </div>
      <h2 className="mt-4 text-2xl font-black leading-tight">{thread.title}</h2>
      <p className="mt-3 text-sm font-bold leading-6 text-[#5d6a5b]">{thread.analysis.summary}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="참여자" value={thread.participants.toLocaleString("ko-KR")} />
        <Metric label="찬성" value={`${thread.votes.agree}%`} />
        <Metric label="반대" value={`${thread.votes.disagree}%`} />
      </div>
    </Link>
  );
}

function DetailedAnalysis({ thread }: { thread: DebateThread }) {
  return (
    <aside className="h-fit rounded-[8px] border border-[#dce5d8] bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cc3b2f]">
        Deep Analysis
      </p>
      <h2 className="mt-1 text-lg font-black">토론 현황과 AI 분석</h2>
      <VotingMeter votes={thread.votes} />
      <div className="mt-4 rounded-[8px] bg-[#f8faf6] p-3">
        <p className="text-sm font-bold leading-6">{thread.analysis.summary}</p>
      </div>
      <AnalysisList title="찬성 측 핵심 논리" items={thread.analysis.agreePoints} side="agree" />
      <AnalysisList title="반대 측 핵심 논리" items={thread.analysis.disagreePoints} side="disagree" />
      <div className="mt-4">
        <p className="text-xs font-black text-[#5d6a5b]">키워드</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {thread.analysis.keywords.map((keyword) => (
            <span key={keyword} className="rounded-[6px] bg-[#eef3ea] px-2 py-1 text-xs font-black">
              {keyword}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        <InfoRow label="흐름" value={thread.analysis.trend} />
        <InfoRow label="과열" value={thread.analysis.risk} />
      </div>
    </aside>
  );
}

function VotingBox({
  issue,
  selected,
  onVote,
}: {
  issue: Issue;
  selected?: VoteSide;
  onVote: (side: VoteSide) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <button
          className={`h-11 rounded-[6px] text-sm font-black ${
            selected === "agree" ? "bg-[#1769aa] text-white" : "bg-[#e8f2fb] text-[#1769aa]"
          }`}
          onClick={() => onVote("agree")}
          type="button"
        >
          찬성
        </button>
        <button
          className={`h-11 rounded-[6px] text-sm font-black ${
            selected === "disagree" ? "bg-[#c5382c] text-white" : "bg-[#fbebe9] text-[#c5382c]"
          }`}
          onClick={() => onVote("disagree")}
          type="button"
        >
          반대
        </button>
      </div>
      {selected && issue.votes ? (
        <div className="mt-3">
          <p className="mb-2 text-xs font-black text-[#5d6a5b]">
            내 투표: {selected === "agree" ? "찬성" : "반대"} · 현재 현황
          </p>
          <VotingMeter votes={issue.votes} />
        </div>
      ) : (
        <p className="mt-2 text-xs font-bold text-[#5d6a5b]">투표하면 현황이 표시됩니다.</p>
      )}
    </div>
  );
}

function VotingMeter({ votes }: { votes: { agree: number; disagree: number; total: number } }) {
  return (
    <div className="rounded-[8px] border border-[#dce5d8] bg-white p-3">
      <div className="flex items-center justify-between text-sm font-black">
        <span className="text-[#1769aa]">찬성 {votes.agree}%</span>
        <span className="text-[#c5382c]">반대 {votes.disagree}%</span>
      </div>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[#fbebe9]">
        <div className="bg-[#1769aa]" style={{ width: `${votes.agree}%` }} />
        <div className="bg-[#c5382c]" style={{ width: `${votes.disagree}%` }} />
      </div>
      <p className="mt-2 text-xs font-bold text-[#5d6a5b]">
        총 {votes.total.toLocaleString("ko-KR")}표
      </p>
    </div>
  );
}

function AnalysisList({
  title,
  items,
  side,
}: {
  title: string;
  items: string[];
  side: VoteSide;
}) {
  return (
    <div className="mt-4">
      <p className={`text-xs font-black ${side === "agree" ? "text-[#1769aa]" : "text-[#c5382c]"}`}>
        {title}
      </p>
      <div className="mt-2 grid gap-2">
        {items.map((item) => (
          <p key={item} className="rounded-[6px] bg-[#f8faf6] p-2 text-sm font-bold leading-6">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function AdminEditor({ draftIndex }: { draftIndex: number }) {
  const draft = adminQueue[draftIndex] ?? adminQueue[0];

  return (
    <div className="rounded-[8px] border border-[#dce5d8] bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cc3b2f]">
        Edit Draft
      </p>
      <h2 className="mt-2 text-3xl font-black">{draft.suggestion}</h2>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-black">
          원문 감지
          <textarea
            className="min-h-24 rounded-[6px] border border-[#cfdcca] p-3 text-sm font-semibold"
            defaultValue={draft.raw}
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black">
            상태값
            <input
              className="h-11 rounded-[6px] border border-[#cfdcca] px-3 text-sm font-semibold"
              defaultValue={draft.status}
            />
          </label>
          <label className="grid gap-2 text-sm font-black">
            게시물 유형
            <input
              className="h-11 rounded-[6px] border border-[#cfdcca] px-3 text-sm font-semibold"
              defaultValue={draft.type}
            />
          </label>
        </div>
        <button className="h-11 w-fit rounded-[6px] bg-[#164a32] px-5 text-sm font-black text-white" type="button">
          게시 승인
        </button>
      </div>
    </div>
  );
}

function PreferenceBlock({
  title,
  options,
  selected,
}: {
  title: string;
  options: string[];
  selected: string[];
}) {
  return (
    <div className="rounded-[8px] border border-[#dce5d8] bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black">{title}</h2>
        <span className="text-xs font-bold text-[#5d6a5b]">{selected.length}개</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            className={`rounded-[6px] border px-2.5 py-1.5 text-xs font-bold ${
              selected.includes(option)
                ? "border-[#164a32] bg-[#164a32] text-white"
                : "border-[#dce5d8] bg-[#f8faf6] text-[#455143]"
            }`}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function IssueBadge({ type, compact = false }: { type: IssueType; compact?: boolean }) {
  const label = type === "forum" ? "핫 토론" : type === "poll" ? "투표형" : "일반 소식";
  const style =
    type === "forum"
      ? "bg-[#f0c46a] text-[#101714]"
      : type === "poll"
        ? "bg-[#cc3b2f] text-white"
        : "bg-[#164a32] text-white";

  return (
    <span
      className={`inline-flex rounded-[6px] ${style} ${
        compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
      } font-black`}
    >
      {label}
    </span>
  );
}

function StatusPill({ status }: { status: RumorStatus }) {
  return (
    <span className="inline-flex rounded-[6px] bg-[#101714] px-3 py-1 text-xs font-black text-white">
      {status} · {statusCopy[status]}
    </span>
  );
}

function Argument({
  label,
  text,
  side,
}: {
  label: string;
  text: string;
  side: VoteSide;
}) {
  return (
    <div
      className={`rounded-[8px] border bg-white/85 p-4 ${
        side === "agree" ? "border-[#8fc5ee]" : "border-[#edaaa3]"
      }`}
    >
      <p className={`text-xs font-black ${side === "agree" ? "text-[#1769aa]" : "text-[#c5382c]"}`}>
        {label}
      </p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#263226]">{text}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[6px] bg-[#f8faf6] p-2">
      <p className="text-xs font-black text-[#5d6a5b]">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6">{value}</p>
    </div>
  );
}

function Metric({
  label,
  value,
  inverted = false,
}: {
  label: string;
  value: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`rounded-[6px] px-3 py-2 ${
        inverted ? "bg-white/10 text-white" : "bg-white/80 text-[#101714]"
      }`}
    >
      <p className="text-[11px] font-black opacity-70">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
}

function countComments(comments: Comment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + (comment.replies ? countComments(comment.replies) : 0),
    0,
  );
}
