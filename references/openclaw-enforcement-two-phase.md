# OpenClaw / 虾魂 / 全局规则：强制两阶段 + 长篇 PERSIST

本文件供 **OpenClaw 虾魂（SOUL）**、**工作区全局规则**或 **用户固定开场**整段复制；与根目录 `SKILL.md` 公理 12、§7、§9 及 `webnovel-memory/references/write-protocol.md` 一致。

---

## 1. 何时生效

| 场景 | 阶段 0–3 |
|------|-----------|
| 开新书 / 续写 / 写第 N 章 / 计划连载的正文 | **全文强制**（含 LOAD + 两阶段 + PERSIST） |
| 用户明确说「一次性短文，不建项目、不留记忆」 | 可跳过 LOAD / PERSIST；仍须 **阶段 1 + 阶段 2**（至少输出 §9 级自检表） |
| 仅大纲 / 人设 / 点评他人文稿 / 纯诊断 | 不要求 PERSIST；若输出他人章节正文，仍建议阶段 2 |

---

## 2. 强制顺序（同一轮回复内不得跳步）

### 阶段 0 · 长篇前置（缺一不得进入阶段 1）

1. 已锁定 `project_root`；若无项目目录 → 先执行 `webnovel-memory` · **INIT**。
2. 写本章正文前 → 必须执行 `webnovel-memory` · **LOAD(project_root, target_chapter)**，把记忆快照（含 `used-patterns`、`soul_fields` 必现清单等）并入上下文。

### 阶段 1 · 仅出稿（DRAFT）

- 允许输出：本章正文、`chapters/ch<NNNN>.md` 所需 frontmatter 要点、**内部用** `chapter_meta` 草稿（可放在折叠块或注释说明中）。
- **禁止**：用「定稿 / 可发 / 本章已完美收工 / 已写入磁盘」等语收束本轮任务。
- **禁止**：声称已完成 **PERSIST**（除非阶段 3 已真实执行完 8 步）。
- 写入项目的 `*.md` 文档默认中文；仅路径、字段键、代号（如 `REV`）可保留英文。

### 阶段 2 · 自检 + 统计对齐 + 必要时重写（VERIFY）

必须**依次**出现以下内容（可合并为同一回复的后半部分，但顺序不能反）：

1. **自检表**：对 `SKILL.md` §9 勾选逻辑逐项给出 `PASS / WARN / FAIL`；对任一 **回滚级 FAIL** 须标出退回的 workflow（见 `write-protocol` 回滚路径表）。
2. **反 AI 味 Part B**：按 `webnovel-pitfalls/workflow.md` 对**本章正文**走一遍判定思路，输出「条款 → 判定 → 量化证据（含关键 `stats` 字段）」表或等价结构。
3. **完整 `chapter_meta.stats`**：字段集合与阈值以 `webnovel-memory/references/write-protocol.md`「一致性检查」为准；数值须与正文可核对。
4. **闭环**：
   - 若存在任一 **FAIL** 或 **回滚级 FAIL**：**不得**进入阶段 3；须在同一回复内**改写正文**（或明确说明退回 `webnovel-plot-design` / `webnovel-story-blueprint` 重做哪一步），然后**重新执行阶段 2**。
   - 全章重写循环 **≤ 2 轮**；仍 FAIL → 使用 `webnovel-pitfalls` 的**拒交付模板**，不得输出虚假 PASS。

### 阶段 3 · 仅当阶段 2 全 PASS（长篇）

- 执行 `webnovel-memory` · **PERSIST**（`write-protocol.md` 八步 + STEP 0 路径契约）。
- **仅当** PERSIST 成功完成后，方可向用户报告「本章已落盘 / 已写入 project」。

---

## 3. 极短版（直接贴入 SOUL.md「行为底线」区块，约 400 字）

```
【网文 xt-webnovel-writing · 强制两阶段 + PERSIST】
凡写连载/新书/第N章正文：先 memory·LOAD（无项目则 INIT），再写稿。
写稿后禁止用「定稿」收束。必须立刻输出：§9自检表 PASS/WARN/FAIL + pitfalls式 Part B 表 + 完整 chapter_meta.stats；
有 FAIL 或回滚级 FAIL 则同轮内改写并重跑自检，最多2轮；仍失败则拒交付说明。
仅当全 PASS 后才允许 memory·PERSIST；PERSIST 成功后才可说「已落盘」。
写入项目的 .md 文档默认中文（路径/字段键/代号除外）。
一次性短文用户声明不写项目时可跳过 LOAD/PERSIST，但仍须自检表。
```

---

## 4. 与宿主能力的关系

- 本文件**不依赖** Cursor / OpenClaw **hooks**；靠虾魂或全局规则把上述顺序钉进模型行为。
- 若宿主支持 hook，可在「写入 `chapters/ch*.md` 之后」追加提醒：未完成阶段 2 全 PASS 不得结束会话（可选）。

---

## 5. 交叉引用

- `SKILL.md` §2 公理 12、§7 全流程、§9 交付前自检  
- `webnovel-memory/references/write-protocol.md` · 一致性检查 + `chapter_meta.stats`  
- `webnovel-pitfalls/workflow.md` · 诊断管线、拒交付模板  
- `webnovel-plot-design/workflow.md` · `draft_prose` 正文输出前自检  
