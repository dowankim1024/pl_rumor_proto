export type IssueType = "normal" | "poll" | "forum";
export type VoteSide = "agree" | "disagree";
export type RumorStatus =
  | "Monitoring"
  | "Interest"
  | "Contact"
  | "Talks"
  | "Advanced"
  | "Here We Go"
  | "Official"
  | "Denied"
  | "Collapsed";

export type Comment = {
  id: string;
  author: string;
  club: string;
  text: string;
  likes: number;
  age: string;
  side?: VoteSide;
  replies?: Comment[];
};

export type Issue = {
  id: string;
  type: IssueType;
  title: string;
  summary: string;
  source: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  status: RumorStatus;
  clubs: string[];
  players: string[];
  tags: string[];
  comments: Comment[];
  saves: number;
  votes?: { agree: number; disagree: number; total: number };
  participants?: number;
  agreeReason?: string;
  disagreeReason?: string;
  tone: string;
};

export type DebateThread = {
  id: string;
  issueId: string;
  title: string;
  status: "진행중" | "뜨거움" | "정리중";
  openedAt: string;
  participants: number;
  comments: Comment[];
  votes: { agree: number; disagree: number; total: number };
  analysis: {
    summary: string;
    agreePoints: string[];
    disagreePoints: string[];
    keywords: string[];
    trend: string;
    risk: string;
  };
};

export const clubOptions = [
  "토트넘",
  "맨유",
  "아스날",
  "리버풀",
  "첼시",
  "맨시티",
  "뉴캐슬",
  "브라이튼",
];

export const playerOptions = [
  "손흥민",
  "브루노",
  "살라",
  "사카",
  "홀란드",
  "팔머",
  "외데고르",
];

const commonReplies: Comment[] = [
  {
    id: "reply-1",
    author: "NorthEnd",
    club: "중립",
    text: "확정처럼 말하지 않고 단계 나눠서 보는 게 맞는 듯.",
    likes: 23,
    age: "8분",
  },
  {
    id: "reply-2",
    author: "MatchDay",
    club: "리버풀",
    text: "출처 티어랑 상태값 같이 보니까 훨씬 덜 헷갈림.",
    likes: 17,
    age: "5분",
  },
];

export const issues: Issue[] = [
  {
    id: "son-future",
    type: "forum",
    title: "손흥민은 토트넘을 떠나야 할까?",
    summary:
      "계약 기간, 나이, 팀의 우승 가능성을 두고 팬들의 의견이 크게 갈리고 있다. 현지 보도는 아직 관찰 단계로 정리된다.",
    source: "London football desk",
    tier: "Tier 2",
    status: "Monitoring",
    clubs: ["토트넘"],
    players: ["손흥민"],
    tags: ["#토트넘", "#손흥민", "#핫토론"],
    saves: 3820,
    votes: { agree: 43, disagree: 57, total: 12842 },
    participants: 12842,
    agreeReason: "커리어 마지막 전성기에 우승 가능성이 높은 팀을 선택해야 한다.",
    disagreeReason: "토트넘의 상징이자 주장으로 남는 가치가 크다.",
    comments: [
      {
        id: "son-c1",
        author: "SpursLab",
        club: "토트넘",
        text: "우승을 생각하면 선택지가 열려 있어야 한다. 감정이랑 커리어 판단은 분리해야 함.",
        likes: 1241,
        age: "12분",
        side: "agree",
        replies: commonReplies,
      },
      {
        id: "son-c2",
        author: "Lilywhite7",
        club: "토트넘",
        text: "토트넘에서의 상징성은 쉽게 포기할 수 없다. 주장으로 남는 가치가 있음.",
        likes: 1108,
        age: "18분",
        side: "disagree",
        replies: [
          {
            id: "son-r1",
            author: "KFan",
            club: "토트넘",
            text: "구단이 우승 플랜만 보여주면 남는 쪽 여론이 더 커질 듯.",
            likes: 88,
            age: "4분",
          },
        ],
      },
    ],
    tone: "from-amber-200 via-white to-emerald-200",
  },
  {
    id: "bruno-sale",
    type: "poll",
    title: "맨유는 이번 여름 브루노를 매각해야 할까?",
    summary:
      "리빌딩과 재정 균형을 위해 핵심 선수 매각 가능성이 거론된다. 확정 단계가 아닌 현지 논의 수준이다.",
    source: "The Athletic / 현지 기자",
    tier: "Tier 1",
    status: "Contact",
    clubs: ["맨유"],
    players: ["브루노"],
    tags: ["#맨유", "#브루노", "#이적시장"],
    saves: 1840,
    votes: { agree: 38, disagree: 62, total: 8042 },
    agreeReason: "높은 이적료를 받을 수 있는 마지막 시점일 수 있다.",
    disagreeReason: "현재 맨유에서 창의성을 대체하기 어렵다.",
    comments: [
      {
        id: "bruno-c1",
        author: "RedBuild",
        club: "맨유",
        text: "지금 팔아야 리빌딩 자금이 생긴다. 감정적으로 잡으면 또 타이밍 놓침.",
        likes: 521,
        age: "21분",
        side: "agree",
        replies: commonReplies.slice(0, 1),
      },
      {
        id: "bruno-c2",
        author: "OldTrafford",
        club: "맨유",
        text: "브루노까지 없으면 공격 전개가 안 된다. 대체자를 먼저 구해야지.",
        likes: 874,
        age: "28분",
        side: "disagree",
      },
    ],
    tone: "from-rose-100 via-white to-cyan-100",
  },
  {
    id: "spurs-centerback",
    type: "normal",
    title: "토트넘, 새 센터백 후보 리스트업",
    summary:
      "여름 이적시장을 앞두고 센터백 보강 후보를 검토 중이다. 아직 공식 제안 단계는 아니다.",
    source: "현지 기자 / 해외 매체",
    tier: "Tier 2",
    status: "Monitoring",
    clubs: ["토트넘"],
    players: [],
    tags: ["#토트넘", "#센터백", "#스카우팅"],
    saves: 980,
    comments: [
      {
        id: "cb-c1",
        author: "BackThree",
        club: "토트넘",
        text: "왼발 센터백이면 우선순위가 맞다. 로테이션이 너무 얇았음.",
        likes: 302,
        age: "1시간",
        replies: commonReplies,
      },
      {
        id: "cb-c2",
        author: "ScoutNote",
        club: "브라이튼",
        text: "가격이 문제지 포지션은 꼭 필요하다.",
        likes: 168,
        age: "45분",
      },
    ],
    tone: "from-emerald-100 via-white to-lime-100",
  },
  {
    id: "arsenal-striker",
    type: "poll",
    title: "아스날은 우승을 위해 공격수를 반드시 영입해야 할까?",
    summary:
      "득점 분산은 강점이지만 박스 안 결정력에 대한 의문은 계속된다. 여름 우선순위를 두고 논쟁이 이어진다.",
    source: "North London beat",
    tier: "Tier 2",
    status: "Interest",
    clubs: ["아스날"],
    players: ["사카", "외데고르"],
    tags: ["#아스날", "#우승경쟁", "#공격수"],
    saves: 2120,
    votes: { agree: 68, disagree: 32, total: 9210 },
    agreeReason: "팽팽한 경기에서 한 골을 해결할 선수가 필요하다.",
    disagreeReason: "현재 구조를 유지하고 미드필더 뎁스를 늘리는 쪽이 낫다.",
    comments: [
      {
        id: "ars-c1",
        author: "GunnerData",
        club: "아스날",
        text: "우승권이면 20골 스트라이커가 필요하다.",
        likes: 744,
        age: "32분",
        side: "agree",
      },
      {
        id: "ars-c2",
        author: "PressTrap",
        club: "아스날",
        text: "전술 균형 깨지는 영입은 조심해야 한다.",
        likes: 299,
        age: "17분",
        side: "disagree",
        replies: commonReplies.slice(1),
      },
    ],
    tone: "from-red-100 via-white to-yellow-100",
  },
  {
    id: "chelsea-youth",
    type: "normal",
    title: "첼시, 고액 유망주 정책 유지 전망",
    summary:
      "구단은 장기 계약 기반 유망주 투자를 계속 검토 중이다. 단기 성적 압박과 재정 규정이 변수로 남아 있다.",
    source: "Club correspondent",
    tier: "Tier 3",
    status: "Talks",
    clubs: ["첼시"],
    players: ["팔머"],
    tags: ["#첼시", "#유망주", "#PSR"],
    saves: 730,
    comments: [
      {
        id: "che-c1",
        author: "BridgeTalk",
        club: "첼시",
        text: "팔머 같은 성공 사례가 있지만 리스크도 너무 크다.",
        likes: 412,
        age: "1시간",
      },
      {
        id: "che-c2",
        author: "BluePlan",
        club: "첼시",
        text: "즉시전력 한 명은 꼭 필요하다.",
        likes: 201,
        age: "38분",
      },
    ],
    tone: "from-sky-100 via-white to-violet-100",
  },
  {
    id: "salah-contract",
    type: "forum",
    title: "리버풀은 살라 이후를 지금 준비해야 할까?",
    summary:
      "살라의 영향력은 여전하지만 계약과 세대교체를 동시에 고려해야 한다는 현지 분석이 늘고 있다.",
    source: "Merseyside reporter",
    tier: "Tier 2",
    status: "Interest",
    clubs: ["리버풀"],
    players: ["살라"],
    tags: ["#리버풀", "#살라", "#세대교체"],
    saves: 1650,
    participants: 6320,
    votes: { agree: 59, disagree: 41, total: 6320 },
    agreeReason: "핵심 의존도를 낮추는 준비가 필요하다.",
    disagreeReason: "살라의 생산성을 대체할 선수는 쉽게 찾기 어렵다.",
    comments: [
      {
        id: "liv-c1",
        author: "KopEnd",
        club: "리버풀",
        text: "준비는 해야 하지만 당장 밀어내자는 얘기는 아님.",
        likes: 491,
        age: "23분",
        side: "agree",
        replies: commonReplies,
      },
      {
        id: "liv-c2",
        author: "AnfieldRun",
        club: "리버풀",
        text: "살라 없는 전술을 상상하기가 아직 어렵다.",
        likes: 382,
        age: "12분",
        side: "disagree",
      },
    ],
    tone: "from-red-200 via-white to-slate-100",
  },
  {
    id: "city-charges",
    type: "forum",
    title: "맨시티 규정 이슈가 전력 평가에 영향을 줘야 할까?",
    summary:
      "징계 가능성과 별개로 현재 전력 평가는 분리해야 한다는 의견과, 구단 리스크를 함께 봐야 한다는 의견이 맞선다.",
    source: "Financial football desk",
    tier: "Tier 2",
    status: "Monitoring",
    clubs: ["맨시티"],
    players: ["홀란드"],
    tags: ["#맨시티", "#규정", "#전력평가"],
    saves: 1260,
    participants: 5810,
    votes: { agree: 47, disagree: 53, total: 5810 },
    agreeReason: "구단 리스크는 선수단 유지에도 영향을 줄 수 있다.",
    disagreeReason: "현재 경기력 평가는 별개로 봐야 한다.",
    comments: [
      {
        id: "city-c1",
        author: "BlueMoon",
        club: "맨시티",
        text: "경기력 얘기에 징계 얘기를 섞으면 토론이 산으로 감.",
        likes: 302,
        age: "19분",
        side: "disagree",
      },
      {
        id: "city-c2",
        author: "TableWatch",
        club: "아스날",
        text: "리스크가 선수 영입과 재계약에 영향을 주면 전력 평가 요소가 맞다.",
        likes: 355,
        age: "25분",
        side: "agree",
      },
    ],
    tone: "from-cyan-100 via-white to-stone-100",
  },
  {
    id: "newcastle-psr",
    type: "normal",
    title: "뉴캐슬, PSR 여파로 매각 후보 검토",
    summary:
      "재정 규정 대응을 위해 일부 선수의 제안을 들을 수 있다는 보도가 나왔다. 구단은 공식 입장을 내지 않았다.",
    source: "Northern football desk",
    tier: "Tier 2",
    status: "Interest",
    clubs: ["뉴캐슬"],
    players: [],
    tags: ["#뉴캐슬", "#PSR", "#이적시장"],
    saves: 640,
    comments: [
      {
        id: "new-c1",
        author: "ToonPlan",
        club: "뉴캐슬",
        text: "챔스 못 간 시즌의 비용이 이제 오는 느낌.",
        likes: 149,
        age: "2시간",
      },
    ],
    tone: "from-zinc-200 via-white to-green-100",
  },
  {
    id: "brighton-manager",
    type: "normal",
    title: "브라이튼, 감독 인터뷰에서 전술 변화 예고",
    summary:
      "다음 시즌에는 빌드업 속도와 측면 전개를 조정할 수 있다는 발언이 나왔다.",
    source: "Club media",
    tier: "Tier 1",
    status: "Official",
    clubs: ["브라이튼"],
    players: [],
    tags: ["#브라이튼", "#전술", "#감독인터뷰"],
    saves: 430,
    comments: [
      {
        id: "bri-c1",
        author: "SeagullView",
        club: "브라이튼",
        text: "선수단 특성상 측면 전개 강화는 자연스러운 선택.",
        likes: 91,
        age: "3시간",
      },
    ],
    tone: "from-blue-100 via-white to-yellow-100",
  },
  {
    id: "palmer-role",
    type: "poll",
    title: "첼시는 팔머 중심 전술을 더 강하게 밀어야 할까?",
    summary:
      "팔머 의존도가 높아졌지만, 오히려 명확한 중심을 세워야 한다는 의견도 많다.",
    source: "London tactics column",
    tier: "Tier 2",
    status: "Monitoring",
    clubs: ["첼시"],
    players: ["팔머"],
    tags: ["#첼시", "#팔머", "#전술"],
    saves: 980,
    votes: { agree: 72, disagree: 28, total: 7440 },
    agreeReason: "팀에서 가장 확실한 차이를 만드는 선수다.",
    disagreeReason: "의존도가 높아질수록 상대 대응도 쉬워진다.",
    comments: [
      {
        id: "pal-c1",
        author: "BlueChance",
        club: "첼시",
        text: "중심을 세우고 주변 조합을 맞추는 게 빠르다.",
        likes: 391,
        age: "14분",
        side: "agree",
      },
      {
        id: "pal-c2",
        author: "TacticalBlue",
        club: "첼시",
        text: "팔머 혼자 해결하는 구조는 시즌 길게 보면 위험하다.",
        likes: 244,
        age: "11분",
        side: "disagree",
      },
    ],
    tone: "from-blue-100 via-white to-orange-100",
  },
];

export const debateThreads: DebateThread[] = issues
  .filter((issue) => issue.type === "forum")
  .map((issue, index) => ({
    id: issue.id,
    issueId: issue.id,
    title: issue.title,
    status: index === 0 ? "뜨거움" : "진행중",
    openedAt: index === 0 ? "2일 전" : index === 1 ? "5일 전" : "1주 전",
    participants: issue.participants ?? issue.votes?.total ?? 0,
    comments: issue.comments,
    votes: issue.votes ?? { agree: 50, disagree: 50, total: 0 },
    analysis: {
      summary:
        index === 0
          ? "반대 의견이 근소하게 우세하지만, 찬성 측의 커리어 타이밍 논리가 빠르게 늘고 있습니다."
          : "찬반이 팽팽하며, 전력 유지와 장기 리스크를 어디까지 함께 볼지에 의견이 갈립니다.",
      agreePoints: [
        issue.agreeReason ?? "장기적인 리스크 관리를 위해 지금부터 준비가 필요하다.",
        "감정적 판단보다 구단 운영과 선수 커리어를 분리해야 한다.",
        "시장 가치가 유지되는 시점에 선택지를 열어야 한다.",
      ],
      disagreePoints: [
        issue.disagreeReason ?? "현재 팀 전력과 상징성을 쉽게 대체하기 어렵다.",
        "대체 플랜이 없는 변화는 팀 밸런스를 무너뜨릴 수 있다.",
        "루머 단계가 낮아 과도한 결론은 이르다.",
      ],
      keywords: issue.tags.map((tag) => tag.replace("#", "")),
      trend: index === 0 ? "최근 30분간 찬성 의견이 6%p 상승" : "댓글 속도는 안정적, 반박 댓글 비중 증가",
      risk: "과열 표현은 낮음. 확정 표현보다 조건부 의견이 대부분입니다.",
    },
  }));

export const adminQueue = [
  {
    source: "X 감지",
    raw: "북런던 클럽이 세리에A 센터백을 다시 관찰 중",
    suggestion: "토트넘, 세리에A 센터백 재관찰",
    status: "Monitoring",
    type: "일반 게시물",
  },
  {
    source: "해외 기사",
    raw: "United rebuild may require a major sale",
    suggestion: "맨유 리빌딩, 핵심 선수 매각 필요할까?",
    status: "Contact",
    type: "논쟁형 게시물",
  },
  {
    source: "커뮤니티 급상승",
    raw: "Son future debate spikes after contract comments",
    suggestion: "손흥민 거취 누적 토론 후보",
    status: "Monitoring",
    type: "핫 토론",
  },
];

export const statusCopy: Record<RumorStatus, string> = {
  Monitoring: "관찰",
  Interest: "관심",
  Contact: "접촉",
  Talks: "협상",
  Advanced: "진전",
  "Here We Go": "합의 임박",
  Official: "공식",
  Denied: "부인",
  Collapsed: "결렬",
};
