---
name: webnovel-memory
description: 长篇网文的持久化记忆系统。当总字数 ≥ 100 万字、章数 ≥ 200、单章 ≥ 4000 字的长篇项目在连续生成过程中需要跨上下文窗口的人物状态、伏笔表、爽点日志、作者指纹、世界观词典和章节倒排索引时触发。通过标准化磁盘目录（Markdown + YAML）为其他子 skill 提供 READ / WRITE 协议，解决 AI 写长篇的失忆、设定漂移、伏笔遗忘、爽点重复、人物修为前后矛盾等问题；同时内建 used-patterns 监控面板（主语分布、段长熵、非理性噪声、质量方差、反派反应套餐、爽点打断类型），把反 AI 味的硬阈值落成跨章驱动力。触发词：记忆、项目、续写、接着写、上次写到、长篇、500 万字、6000 字、人物卡、伏笔、设定管理、世界观一致、memory、project、long novel。
metadata: {"openclaw":{"emoji":"🧠","os":["darwin","linux","win32"]}}
---

# 长篇网文记忆系统

> 写 500 万字的书，上下文窗口永远装不下。本 skill 用"磁盘即记忆"的方式，让 agent 每一章都能拉齐最小必要的历史上下文，并在生成后把新状态固化下来。

## When to Use

- 用户在一个具体 `project_root` 目录下持续写长篇（≥ 100 万字目标），需要跨会话保持状态。
- 用户说"接着上次写的第 X 章往下写"、"别忘了之前 Y 伏笔"、"帮我看看这个人物现在什么修为"。
- 其他子 skill 进入**正文生成模式**（`webnovel-plot-design` 的 `draft_prose` / `webnovel-excitement-and-craft` 的改写）之前，必须先调用本 skill 拉上下文。

### Avoid when

- 短篇（< 5 万字）或一次性单章写作——直接走 `webnovel-plot-design` 即可，没必要持久化。
- 用户没指定 `project_root`，且任务明确是 "一次性生成" 不续写的。
- 仅仅做文本诊断 / 拆解（`webnovel-pitfalls` / `webnovel-text-analysis`），不需要写磁盘。

## 三份参考文件（必读，按场景取用）

本模块 `workflow.md` 位于 `webnovel-memory/` 目录下，以下路径相对该目录：

| 文件 | 何时读 |
|---|---|
| `./references/directory-schema.md` | 初始化项目 / 确认某个文件的字段模板时 |
| `./references/read-protocol.md` | 每次生成新章**之前**，拉取必要上下文 |
| `./references/write-protocol.md` | 每次生成新章**之后**，把状态固化到磁盘 |

其余公共文件（反 AI 味 / 方法论底本）位于仓库根 `../references/`。

## 工作模式

### 模式 1 · INIT（初始化项目）

触发：用户首次进入 project_root、或目录下不存在 `book.yaml`。

1. **确定 `project_root`**（决策优先级）：
   1. 用户显式指定路径（最高）
   2. 同工作目录下已有 `book.yaml` 的文件夹
   3. 询问用户：书名或短名（默认 `${book_title_slug}`）→ 在当前工作目录下新建该名称目录作为 `project_root`
   4. 若什么都缺 → 退出并要求用户补齐

   `project_root` 一旦确定 → 立即锁定写入 `book.yaml.project_root`，本次会话不得更改。
2. 询问：长篇预估规模（总字数 / 单章字数 / 章数估计），填入 `book.yaml.target_length` 和 `estimated_chapter_length`
3. 按 `directory-schema.md` 创建全部空壳目录和空文件（**必须一次性建全 §11 定义的全部子目录**，包括 `state/anti-trope-log.md` 这类新文件）
4. 若用户已有 `webnovel-story-blueprint` 的立书档案 → 直接把字段灌入 `book.yaml` 和 `fingerprint.md`
5. 若没有 → 路由到 `webnovel-story-blueprint` 先跑立书，再回到本 skill 固化
6. **输出给上游**：锁定后的绝对 / 相对 `project_root` 路径 + 固定子目录清单。后续所有子 skill 写文件时**必须**以此为前缀，否则 PERSIST 拒收。

### 模式 2 · LOAD（生成前拉上下文）

触发：任何其他子 skill 要写正文或续写前。

1. 执行 `read-protocol.md` 的 Phase 1–4（总是）+ Phase 6（公共 references）
2. 按需执行 Phase 5（检索型查询）
3. 产出"**记忆快照**"（见 read-protocol.md 末尾的装填模板），交给上游 skill 作为 prompt 上下文

### 模式 3 · PERSIST（生成后落盘）

触发：上游 skill 生成完一章并通过反 AI 味自检后。

1. 接收 `chapter_body` + `chapter_meta`（结构见 write-protocol.md 输入段）
2. 执行 `write-protocol.md` 的 8 步落盘（STEP 0 路径契约校验 + STEP 1–7 内容落盘）
3. 跑末尾的一致性检查；失败则回滚
4. 返回成功确认（写入文件清单 + 受影响的人物 / 伏笔 / arc 列表）

### 模式 4 · QUERY（按需检索）

触发：用户问"张三上次出场在哪"、"F-007 伏笔是什么"、"玄铁重剑第几章出现"。

1. 根据问题类型选索引文件：
   - 人物 → `index/by-character.md` + `characters/<name>.md`
   - 地点 → `index/by-location.md`
   - 物品 / 功法 / 法宝 → `index/by-item.md`
   - 伏笔 → `state/foreshadow.md`（按 ID 或内容模糊匹配）
   - 章节内容 → `index/chapter-log.md`
2. 返回"最近一次 + 命中章号列表 + 摘要"

### 模式 5 · AUDIT（周期性一致性审计）

触发：用户每写完 10 章、或主动要求"帮我检查一下前面有没有坑"。

1. 扫描所有 `chapters/*.md` 的 frontmatter
2. 重建 `index/*.md`（可丢弃原文件）
3. 交叉验证：
   - 每个 `live` 伏笔埋点章 ≤ 当前章 - 100 → 标记 `expired`
   - 每个角色的修为历史轨迹是否单调（没有无理由降级）
   - `glossary.md` 里每条词是否在至少 1 章出现过
   - `used-excitement.md` 最近 20 章是否存在单一类型占比 > 40%（说明爽点单一）
   - `used-excitement.md` 最近 20 章是否存在同一 `interruption` 类型占比 > 60%（说明打断手法单一）
   - `used-patterns.md` 最近 10 章主语 top-1 占比平均是否 > 35%（说明全局主语单调）
   - `used-patterns.md` 最近 10 章段长方差与具象度方差平均是否持续偏低（全局质量曲线过稳定）
   - `used-patterns.md` 最近 10 章非理性噪声覆盖率是否 < 100%（全局算法味）
4. 产出审计报告给用户，并给每条不达标项附"接下来 3 章的修正建议"

## 读写顺序硬约束

**生成任何一章前后**必须走：

```
[其他 skill 请求写章 N]
    │
    ▼
[webnovel-memory · LOAD] ──→ 记忆快照
    │
    ▼
[其他 skill 生成正文 + 反 AI 味自检]
    │
    ▼
[webnovel-memory · PERSIST] ──→ 8 步落盘（含 STEP 0 路径契约校验）+ 一致性检查
    │
    ▼
[交付给用户]
```

绕过本 skill 直接写章 → 违反套件铁律，上游 skill 会拒绝交付。

## 上下文预算

针对 500 万字 / 6000 字每章 / 833 章的目标规模，单次 LOAD 产出的"记忆快照"预算：

| 区块 | 目标字数 | 超限行为 |
|---|---|---|
| 书籍常量 + 作者指纹 | ≤ 500 | 压缩动词/物象数量 |
| 当前 arc 状态 | ≤ 400 | 只取矛盾句 + 八步位置 |
| 相邻 3 章摘要 | ≤ 900（300×3） | 超限丢最早一条 |
| live 伏笔（top 3–5） | ≤ 600 | 只取与本章 arc 相关的 |
| 活跃角色状态 + signature_reactions | ≤ 900 | 每人不超过 220 字 |
| 禁用清单（句式/爽点/套餐词） | ≤ 300 | — |
| 反 AI 味监控面板摘要 | ≤ 900 | 主语 / 段长 / 噪声 / 方差 / 打断 / **definition_style_hits / bold_theme_hits / emotion_token_hits / single_sentence_run_max / single_sentence_para_ratio / long_paragraph_count / signature_明牌超限名单 / setting_reveal_overload_hits / transition_types 分布 / filler_density / side_char_autonomous_agenda 名单 / waste_option_ratio** |
| 本章首登关键角色 soul_fields（≥ 2 条） | ≤ 300 | 回滚级硬门准备 |
| 上一章 anti-trope 5-清单 + 怪异预算 + 延迟兑付清单 | ≤ 300 | P-4 防重复 |
| **合计** | **≤ 4800** | 硬上限 5500 |

## 存储体积估算

833 章项目完整 project_root 的典型磁盘占用：

| 路径 | 预估 | 说明 |
|---|---|---|
| `chapters/` | ≈ 10 MB | 6000 字 × 833 章 × 2 bytes/字 |
| `index/chapter-log.md` | ≈ 400 KB | 500 字摘要 × 833 |
| `state/*` + `bible/*` | ≈ 200 KB | 动态状态 |
| `characters/*` | ≈ 500 KB | 主要角色 + 配角 |
| `arcs/*` | ≈ 50 KB | 10–20 个 arc |

总计 < 20 MB，完全可承载。

## 错误处理

| 故障 | 降级 |
|---|---|
| `project_root` 路径不存在 | 询问用户是否要创建 |
| 权限不足写入 | 提示检查，不继续 |
| YAML 解析失败 | 备份坏文件到 `.webnovel-memory/corrupt/`，降级为空结构继续 |
| 写入一致性检查失败 | 自动回滚；把未通过项报告给上游，让 agent 重写章节 |
| 索引与章节 frontmatter 不一致 | 触发 AUDIT 模式全量重建 |

## 最小集成示例

```
用户：「接着第 86 章往下写，第 87 章写主角破阵夺剑」

[agent]
1. 检测 project_root = ./天剑无尘（含 book.yaml）→ 不需 INIT
2. 调用 webnovel-memory · LOAD(target_chapter=87)
   → 返回记忆快照（3200 字，含：柳长风在 L2 为敌；F-005 天剑诀伏笔 live；
      最近爽点 PWR-PWR，本章禁止 PWR 连用；叶无尘当前金丹初期；...）
3. 调用 webnovel-plot-design · draft_prose(snapshot, target_chapter=87)
   → 返回 6300 字正文 + meta
4. 反 AI 味自检 PASS
5. 调用 webnovel-memory · PERSIST(chapter_body, chapter_meta)
   → 写入 7 类文件；一致性检查 PASS；`F-005` → used；`F-012` 新 live
6. 交付用户：第 87 章 + 修改摘要
```

## 说明

- 本文件是 `xt-webnovel-writing` skill 的**内部模块**，不是独立 skill，由根 `SKILL.md` 路由进来。
- 只进行本地文件 I/O，不包含任何网络请求、不调用外部服务。

> 本模块仅定义协议和文件模板；真正的读写执行由 agent 用 Read / Write / Edit 工具完成。skill 自身不含可执行代码。
