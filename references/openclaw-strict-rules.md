# OpenClaw 严格执行规则

目标：解决「不走 skill」「不按目录落盘」「正文夹带 Markdown」三类常见失控。

---

## A. 执行优先级（必须遵守）

1. 凡涉及小说编写相关请求，**必须先调用** `xt-webnovel-writing` 根 `SKILL.md` 路由流程。
2. 若请求是「新书 / 连载 / 写第 N 章 / 续写」，必须按顺序：
   - `memory INIT/LOAD`（无项目先 INIT）
   - `plot-design draft_prose`
   - `§9 自检 + chapter_meta.stats`
   - 全 PASS 后 `memory PERSIST`
3. 任何一步失败，不得声称「定稿 / 已落盘 / 已完成」。

---

## B. 输出与格式硬约束

1. 小说正文输出时，禁止使用 Markdown 装饰语法作为正文内容（如 `#` 标题、列表符号、代码围栏）。
2. 允许使用 Markdown 的场景仅限：结构化报告、自检表、诊断表、配置说明。
3. 正文文本必须是纯叙事段落（可含对话），不得写成提纲式条目。
4. **所有生成并写入项目的 Markdown 文档（`*.md`）默认使用中文**：章节正文、人物卡、arc、state、index、诊断卡、写作日志均需中文。
5. 仅允许以下内容保留英文：固定文件名 / 路径 / 字段键（如 `chapter_meta.stats`）/ 爽点代号（如 `REV`）/ 必要代码片段。除这些外，不得输出整段英文说明。
6. 章节终稿命名强制 SFNC：`chapters/chNNNN.md`（如 `ch0001.md`）。严禁 `part1` / `part2` / `expanded_beats` / `draft` 等碎片命名作为最终交付物。
7. 索引命名强制 SFNC：`index/volume_<VOLUME_NO>_index.md`（如 `volume_1_index.md`），用于章节列表与进度导航。

---

## C. 路径与落盘硬约束

1. 长篇项目写入路径必须位于 `<project_root>/` 下固定目录：
   `book.yaml`, `fingerprint.md`, `bible/`, `characters/`, `arcs/`, `chapters/`, `state/`, `index/`, `.webnovel-memory/`
2. 禁止写入上述之外的目录（如 `tmp/`, `drafts/`, `output/`）。
3. 若路径不合规：立即中止落盘，返回「路径违规 + 正确目标路径」。

---

## D. 最小可执行版本（短规则）

将下面整段直接贴入 SOUL/全局规则：

```text
【网文强制执行】
网文请求必须先走 xt-webnovel-writing 路由，不得跳过 skill。
连载/新书/第N章：必须 INIT/LOAD -> DRAFT -> VERIFY(§9自检+chapter_meta.stats) -> 全PASS后PERSIST。
未全PASS不得说“定稿/已落盘”。
正文输出禁止 Markdown 装饰（#、列表、代码块），正文必须是纯叙事段落。
所有写入项目的 .md 文档默认中文；仅文件名/字段键/代号可保留英文。
章节终稿文件名必须是 chapters/chNNNN.md；禁止 part1/part2/expanded_beats 等碎片终稿命名。
索引统一使用 index/volume_<VOLUME_NO>_index.md 管理章节与进度。
所有写入必须在 <project_root>/ 固定目录契约内；越界路径一律拒收并返回纠正路径。
```

---

## E. 搭配 hooks（可选但建议）

- 启用 `two-phase-guard`：用于会话级提醒，降低“跳过自检”概率。
- 注意：hook 是提醒与流程钩子，不等于完整业务校验器；最终仍以本规则 + `write-protocol` 硬门为准。
