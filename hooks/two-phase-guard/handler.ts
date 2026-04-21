type HookEvent = {
  type: string;
  action?: string;
  messages?: string[];
  context?: {
    content?: string;
    workspaceDir?: string;
  };
};

const FINAL_CLAIM_RE =
  /(定稿|可发|已落盘|已写入(?:项目|磁盘)|本章已完成|收工|交付完成)/i;

const VERIFY_SIGNAL_RE =
  /(PASS|FAIL|自检表|chapter_meta\.stats|Part B|回滚级 FAIL|PERSIST)/i;

function pushMessage(event: HookEvent, text: string): void {
  if (!Array.isArray(event.messages)) return;
  event.messages.push(text);
}

const handler = async (event: HookEvent): Promise<void> => {
  // Session reminders on new/reset.
  if (event.type === "command" && (event.action === "new" || event.action === "reset")) {
    pushMessage(
      event,
      "[two-phase-guard] 连载/新书章节请按顺序执行：LOAD -> DRAFT -> VERIFY(自检表+chapter_meta.stats) -> 全PASS后PERSIST。"
    );
    return;
  }

  // Stop reminder to avoid finishing without verification.
  if (event.type === "command" && event.action === "stop") {
    pushMessage(
      event,
      "[two-phase-guard] 停止前确认：若是章节正文，请先输出§9自检与stats；有FAIL需同轮重写，只有全PASS才可声明已落盘。"
    );
    return;
  }

  // Outbound content heuristic warning.
  if (event.type === "message" && event.action === "sent") {
    const content = event.context?.content ?? "";
    if (!content) return;

    const hasFinalClaim = FINAL_CLAIM_RE.test(content);
    const hasVerifySignal = VERIFY_SIGNAL_RE.test(content);

    if (hasFinalClaim && !hasVerifySignal) {
      pushMessage(
        event,
        "[two-phase-guard] 检测到“定稿/完成”类措辞，但未见明显自检信号。建议补充：§9自检表 + chapter_meta.stats；仅全PASS后再说已落盘。"
      );
    }
  }
};

export default handler;
