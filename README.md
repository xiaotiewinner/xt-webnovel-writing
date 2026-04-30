# xt-webnovel-writing

中文网络小说写作 agent —— 一个 OpenClaw / Hermes skill。

整个仓库就是一个 skill：**根目录 `SKILL.md` 是唯一入口**；内部由 6 个 `workflow.md` 模块串联完整流水线：参考文本拆解 → 立书 → 剧情设计 → 爽点与文笔 → 反 AI 味体检 → 项目持久化记忆。

## 约定

- 所有文案、模板、交付物默认 **全中文**。

## 反 AI 味（25 项）与硬门摘要

skill 内置 **18 主条款 + 7 子条款（共 25 项）**「反 AI 味」检测，覆盖面广，包括但不限于：

- **句式与节奏**：句式复用、主语单调、句长熵；**单句段瀑布流**（连续 ≤ 2、占比 ≤ 0.3 等）。
- **信息与世界**：「世界无自主生活」、闲笔密度、配角自主议题、废选项戏剧化、**D-4** 句法缀笔 / 反剪辑体。
- **节拍与观感**：节拍器推进；**A-补充**（章首刺点、好奇缝隙、纯氛围连段上限）。
- **情感与文笔**：情感标签（含独段 + 粗体）、反应套餐、signature 明牌、设定说明书、9 种定义体、角色「PPT 直讲」、算法思维链。
- **元层级指纹**：爽点链条过完整（M）、质量曲线过稳定（N）、粗体滥用（N-细）。
- **角色与人格**：灵魂缺位、首登强制渗透；**O-补充** 镜头分层；**O-在场** 禁止元叙事（如「上一章」「读者」等）。
- **剧情与想象力**：算法化推进、怪异预算、延迟兑付、反套路 5-清单；**P-补充 7** 等背景投喂抑制。
- **转场**：5 类桥、禁用词、摩擦点；**黏滞转场 / 瞬移切换**。
- **句法层**：说明书式排除枚举、教程体微动作链（**R**）、**K-补充** 场景块空行；**R-补充**「不是…是…」系；**E-补充 8 / N-补充 2** 等。

以下为 **回滚级硬门**（任一命中则整章退回指定 workflow）：  
D / M / N / N-细 / O / P / Q / **R** / G+1 / E（独段 + 粗体）/ K（无长段 **或 K-补充违规 ≥ 5**）/ C（连续单句段或占比过线）/ **A-补充** / **O-在场**（meta_language）。

**说明**：I-补充、P-补充 2 / 7、E-补充 8、N-补充 2 等为「并入主条款的扩展」，**不额外增加** 25 项计数。

## 角色与现实感

**角色必有灵魂**：有名角色（含动物 / 灵兽 / 反派 / 路人体系内要求）须有可区分的内在维度，并在正文里至少一次 **非功能性**「被偶然看见」；禁止纯功能性空心 NPC。

**连载记忆**：项目型写作默认走磁盘持久化（memory），缓解失忆、设定漂移、伏笔遗失、战力矛盾、灵魂蒸发等问题。仅当用户明说「一次性短文，不建项目」时可豁免。

## 目录结构

```
xt-webnovel-writing/                    ← OpenClaw skill 根（唯一入口）
├── SKILL.md                            ← 主入口 · 角色 / 公理 / 路由 / 全流程
├── README.md                           ← 本文件
├── .clawhubignore
├── references/                         ← 全 skill 共享
│   ├── anti-ai-tells.md                ← 反 AI 味 18 主 + 7 子条款（25 项，含 D / O / P / Q / R 回滚级硬门）
│   ├── openclaw-enforcement-two-phase.md ← OpenClaw：强制两阶段（稿→自检）+ 项目 PERSIST 顺序；可并入虾魂
│   ├── openclaw-hooks-setup.md         ← OpenClaw hooks 启用与验证
│   ├── openclaw-hooks-config.example.json ← OpenClaw hooks 配置示例
│   ├── openclaw-strict-rules.md        ← SOUL/全局规则：强制先用 skill + 两阶段 + 固定目录契约
│   └── foxsan-webnovel-manual.md       ← 方法论底本
├── hooks/
│   └── two-phase-guard/                ← OpenClaw internal hook（两阶段顺序提醒）
│       ├── HOOK.md
│       └── handler.ts
├── webnovel-text-analysis/
│   └── workflow.md                     ← 拆解已有文本，提取风格指纹
├── webnovel-story-blueprint/
│   └── workflow.md                     ← 主线/人设/书名/大纲/简介/作者指纹
├── webnovel-plot-design/
│   └── workflow.md                     ← 剧情结构 · 八步节奏 · 章节正文草案
├── webnovel-excitement-and-craft/
│   └── workflow.md                     ← 爽点生成 + 四层文笔改写（含反 AI 味层）
├── webnovel-pitfalls/
│   └── workflow.md                     ← 双路体检：结构 10 项 + 反 AI 味 25 项
└── webnovel-memory/                    ← 项目记忆系统（磁盘即记忆）
    ├── workflow.md
    └── references/
        ├── directory-schema.md         ← 项目目录与字段模板
        ├── read-protocol.md            ← 生成前 LOAD 协议
        └── write-protocol.md           ← 生成后 PERSIST 协议
```

**说明**：OpenClaw 规范下「一个 skill = 一个目录 + 一个根 `SKILL.md`」。本仓库作为 ClawHub slug 发布时，**仅有根 `SKILL.md`** 会被识别为 skill；各 `webnovel-*/workflow.md` 由根 `SKILL.md` **按需加载**，不是独立 skill。

## 能力速览

根 `SKILL.md` 按意图关键词路由：

| 场景 | 路由目标模块 |
|---|---|
| 分析 / 拆这段 / 学这种风格 / 模仿 | text-analysis |
| 定主线 / 起书名 / 写人设 / 大纲 / 简介 | story-blueprint |
| 写开头 / 前几章 / 剧情节奏 / 写正文 / 续写 | plot-design |
| 不够爽 / 爽点 / 改文笔 / 画面感 / 去 AI 味 | excitement-and-craft |
| 检查 / 点评 / 自检 / AI 味 / 哪里不对 | pitfalls |
| 续写 / 接着写 / 上次写到 / 项目初始化 | memory |

### 双模式（宽松 / 严格）

正文任务显式区分 mode（与 `SKILL.md` 一致），口语可对应为：

- **`explore`（宽松）**  
  构思、试写、草稿、多版本分支。优先想象力与差异化；可保留受控粗糙。输出风险清单与最小修补建议；**不因风格类单项**直接判定整章回滚。

- **`publish`（严格）**  
  定稿、交付、落盘前验收。跑全量硬门与回滚级条款；任一 FAIL 须重写；回滚级须退回对应 workflow 后重跑。

**未指定时的默认推断**：

1. 意图偏「构思 / 试写 / 草案 / 候选」→ `explore`
2. 意图偏「定稿 / 交付 / 落盘 / 发布前检查」→ `publish`
3. 同一章推荐：`explore` → `publish`（先放量再收敛）

### 近期能力增补（简述）

以下能力在流水线与监控字段中已有落点，明细见各 `workflow` 与 `write-protocol`。

- **章节类型骨架 + 反镜像**：不同章节类型用不同节拍骨架；禁止连续镜像复刻同一结构。
- **I-补充 · 对话次文本**：高张力对话要求次文本错位；完美一问一答链有长度上限。
- **章际对比矩阵**：跟踪 `relation_tension` / `mc_info_delta` / `chapter_mood` / `ending_hook_type`；连续同质化须变向。
- **两阶段 · 内嵌分隔**：草稿与自检之间可用固定分隔标记，确保 VERIFY 先于 PERSIST 叙事口径。
- **E-扩展 6 · 关系递增**：双轨递进、默认小幅步进；跨级须有「触发 + 代价 + 余波」与对应 stats。
- **E-扩展 7 · 主角去模板**：主角须有明显非通货人格与主动触点；禁止默认「沉默谨慎」一锅端。
- **R-补充**：「不是…是…」系全章零容忍，`contrastive_negation_*` 等字段须在 stats 中为 0（见 `anti-ai-tells`、`write-protocol`、`openclaw-enforcement-two-phase`）。

## 八条公理（全套共享）

1. **矛盾 → 剧情 → 爽点**。倒挂就重写。
2. 主角 **第 1 章前 200 字内** 必须出场并有动作。
3. 主角须有 **持续生效的缺点**。
4. 书名必须能指向 **具体的第一个爽点**。
5. **反 AI 味 25 项**  
   「全部 PASS」才视为达标验收；前述 **回滚级硬门** 任一触发须整章回退重写（细则以 `references/anti-ai-tells.md` 与落盘一致性检查为准）。
6. **角色灵魂（分层）**  
   - 关键角色（主角 / POV / 主干感情线 / 核心反派 / 固定核心配角等）：`soul_fields ≥ 2`，首登章须有渗透（回滚级）。  
   - 高频有名角色：`soul_fields ≥ 1`，每次出场须有渗透。  
   - 动物 / 灵兽：独立反应轴；反派：第三维度。  
   - 渗透须 **非功能性**（删掉该句不妨碍剧情推进）。
7. **新书与连载**：默认 memory · LOAD / PERSIST；无 `project_root` 则先 INIT；用户明说「不写项目」的可跳过。
8. **文笔基线**：短句 + 画面感 + 共鸣；辞藻堆砌不是目的。

## 反 AI 味能力 · 表格与延伸阅读

skill 对「另一台模型易识别的 AI 味」做多轮诊断反推，形成 **25 条** 可检条款。**完整条文与阈值**请以 `references/anti-ai-tells.md` 为准。

以下为 **缩写表**（生成期规避 / 诊断信号一览）：

| # | 条款 | 生成期规避 | 诊断期信号 |
|---|---|---|---|
| A | 节拍器（+ **A-补充**） | 无回报铺垫节奏；章首刺点；好奇缝隙；纯氛围峰 | 可被功能标签打满的连段过长；刺点或缝隙缺失 |
| B | 句式语义复用 | 同句式 ≥ 2 即换写 | 10 章内同句式堆积 |
| **B-扩展** | 主语 / 句长熵 | top-1 主语段占比、段长离散度达标 | 「他」段占比过高且匀速 |
| **C** | 单句段瀑布 | 连续单句段、占比有上限 | 连续或占比触发回滚级 |
| **D** | 世界无自主生活（+ **D-4**） | D-1～D-3 + 句法缀笔 / 反剪辑 | 纸片配角、零摩擦、剪辑体硬连 |
| E | 情感标签 | 形容词锚定动作 / 生理 | 只有抽象情绪词 |
| **E-扩展** | 反应套餐 | 反派 signature 与禁套餐词 | 标准套餐过载 |
| F | 修为清单 | 等阶进场景带代价 | 独段堆砌数字 |
| G | 设定说明书 | 一次一条、体感带出 | 列表讲堂 |
| **G-扩展** | 定义体 / 并列体系 | 限次、拆章 | 排比说明书 |
| H | 最优解战斗 | 干扰量、场外感官 | 全程无失误 |
| **H-扩展** | 算法思维链 | 思考段含非理性噪声 | 四步顺滑链 |
| I | 对话功能过载 | 角色不可互换的同句 | 对调无损 |
| J | 套路节点密度 | 单章节点类型受限 | 节点过密 |
| K | 段长 + **K-补充** | 短中长阶梯；大跳变须空行 | 全无长段或场景块黏段 |
| L | 作者指纹 | 贴合 `fingerprint.md` | 书面腔无癖 |
| **M** | 爽点链条过完整 | 每条带 delay/denied/cost | 全兑现无打断 |
| **N** | 质量曲线过稳 | 周期波动；亮粗各一 | 全章匀速「优秀」 |
| **O** | 灵魂缺位（+ **O-补充/O-在场**） | soul_fields、渗透、分层、禁元叙事 | 工具人、同质化冷处理 |
| **P** | 想象力贫血（+ **P-扩展**） | 怪异预算、延迟兑付、5-清单 | 可当章猜中一切 |
| **Q** | 转场黏滞 | 五类桥；禁词；摩擦 | 连用于是接着、瞬移 |
| **R** | 说明书句法（+ **R-补充**） | 枚举 / 微步链 / 验收对句 | 统计字段触阈 |

**完整内容**：`references/anti-ai-tells.md`。

### 条款演进沿革（简述）

为多轮补强后的归档摘要，便于理解「为何不越来越碎」：**细节仍以 anti-ai-tells 正文为准**。

- **早期（约第 4～5 轮）**：补强 O · 灵魂；G+1 九模板；E/E+2；G-细 / N-细；C/K 回滚阈值；关键角色首登硬门。
- **第 6 轮**：D 升格「世界自主生活」；新增 P · 想象力、Q · 转场机械；收紧 C 单句占比。
- **第 7 轮**：R（说明书句法）；K-补充（场景块空行）。
- **第 8 轮**：O-在场（禁元叙事）；A-补充（刺点 + 好奇缝隙）。
- **第 9～11 轮**：D-4 句法层；O-补充镜头；P/E/N 的补充条（背景块、微表情模板、首章收束等）。
- **第 12 轮起**：**绿线**软分布（多字段告警、一般不单独回滚）。
- **第 13～14 轮**：「伪人味」「叙述者隐身」链路（多部 B/E/G/O/N/C、D/G/O/I/N/L 补充）。

### 绿线（非阻断）

须按流程回填部分分布类字段（如 `style_temperature_band`、`human_noise_hits` 等）。**缺字段 = 流程不完整**；数值偏离一般以告警与下章纠偏为主，**不单独**作为唯一回滚条件。

### 六条洞察（精读仍看 anti-ai-tells）

1. **语言层**：「太稳定地优秀」—— M / N 等兜元层级指纹。  
2. **叙事层**：「纸人」—— O 兜主体性；memory 跨章盯渗透缺位。  
3. **世界层**：「无自主生活 + 剪辑叙述」—— D（含 D-4）组合拳。  
4. **剧情层**：「算法 + 机械转场」—— P 破算法，Q 破黏滞。  
5. **句法层**：「说明书手势」—— R 与 K-补充。  
6. **在场感**：故事内时间、章首问题钉—— O-在场 与 A-补充。

---

## 项目持久化记忆（memory）

**目标量级示例**：约 500 万字、6000 字/章量级（可按书目调整）。

**目录契约**（权威定义）：

- `webnovel-memory/references/directory-schema.md`
- `webnovel-memory/references/write-protocol.md`

要点：`project_root` 写入 `book.yaml` 锁定；所有产物须在契约子目录内，否则 **PERSIST 拒绝**。

### 默认目录树（节选）

```
<project_root>/
├── book.yaml
├── fingerprint.md
├── bible/
├── characters/
├── arcs/
├── 全书企划/
├── chapters/
├── state/
│   ├── chapter_meta/
│   ├── foreshadow.md
│   ├── timeline.md
│   ├── power-level.md
│   ├── used-excitement.md
│   ├── used-patterns.md
│   ├── anti-trope-log.md
│   └── open-threads.md
├── index/
└── .webnovel-memory/
```

**章节命名（SFNC）**

- **仅允许**终稿：`chapters/chNNNN_短标题.md`（四位章号 + 下划线 + 短标题）。
- **`chapters/chNNNN.md`**、`part*`、`draft` 等碎片化命名：**不合规**，STEP 0 会拒收。

### 每一章闭环（流程要点）

不要求背细节，但必须知道顺序：**LOAD → 写稿 → VERIFY（自检 + stats）→ 全 PASS 后 PERSIST**。

```
[用户] 写第 N 章

[memory · LOAD]
  · book.yaml / fingerprint
  · 当前 arc · 相邻章摘要 / 钩子
  · live 伏笔、soul_fields 清单、禁用清单
  · 企划：全书企划/00-总览 + 当前 Block

[plot-design · draft_prose]
  · prompt 内含 anti-ai-tells + 反套路预声明等

[VERIFY]
  · 25 项与回滚硬门逐项过；FAIL / 回滚级须同轮重写或退回 workflow

[memory · PERSIST]
  · STEP 0 路径契约 → 正文 + chapter_meta YAML → index / state / 人物卡 / arc / 全书企划 …

[交付]
```

**企划模板**：`webnovel-memory/references/book-plan-templates.md`。

### 周期性审计（约每 10 章）

可申请 **memory · AUDIT**，关注点包括：

- 长期未兑现伏笔、战力无理由跳水、专有名词遗漏  
- 爽点类型 / 打断类型**长期偏科**  
- 主语、段长方差长期过稳  
- **反 D**：闲笔 / 配角自主议题失守  
- **反 P**：怪异预算或延迟兑付长期枯竭  
- **反 Q**：转场桥偏食或禁用词触底  
- 索引与 `state/chapter_meta`、正文路径不一致  

---

## 安装

### 通过 ClawHub（推荐）

在 OpenClaw 工作区根目录执行：

```bash
openclaw skills install xt-webnovel-writing
```

安装后仓库一般在 `<workspace>/skills/xt-webnovel-writing/`，根 `SKILL.md` 自动挂载。

**强制流程**：skill 文档**不会自行执行**。请把 `references/openclaw-enforcement-two-phase.md` **全文或其「极短版」** 贴入 **虾魂（SOUL）或全局规则**，保证：

`LOAD → 出稿 → 自检与 stats →（FAIL 则同轮重写）→ 全 PASS 后再 PERSIST`

**可选**：启用项目级 hook：

```bash
openclaw hooks list
openclaw hooks enable two-phase-guard
openclaw hooks check
openclaw hooks info two-phase-guard
```

详见 `references/openclaw-hooks-setup.md`；示例配置见 `references/openclaw-hooks-config.example.json`。

### 手动安装

将 `xt-webnovel-writing/` 放到 OpenClaw / Hermes 会扫描的 skill 路径（优先级从高到低）：

- `<workspace>/skills/xt-webnovel-writing/`
- `<workspace>/.agents/skills/xt-webnovel-writing/`
- `~/.agents/skills/xt-webnovel-writing/`
- `~/.openclaw/skills/xt-webnovel-writing/`

新开会话后应能装载根 `SKILL.md`。

验证：

```bash
openclaw skills list
# 应能看到 xt-webnovel-writing
```

### AgentSkills（Claude Code 等）

本 skill 可与 [AgentSkills](https://agentskills.io) 兼容；支持的 agent 可将本目录作为 skill 根挂载。

---

## 使用方式

### 新书启动

1. 在 **SOUL / 全局规则** 写明：写作前挂载本 skill，写后自检并按 memory 契约落盘（可引用 `openclaw-enforcement-two-phase.md` 极短版）。  
2. 新建会话后说明：题材、总字数目标、大致章长。  
3. 按 AI 给出的选项完成 INIT → blueprint → 逐章流水线。

示例 SOUL 片段（可自行改写）：

```markdown
你在写作前后必须遵循项目内【xt-webnovel-writing】的根 SKILL.md；
连载正文须走 LOAD → 自检与 stats → 通过后再 PERSIST，不得谎称已落盘。
```

### 单章写作

1. 「查看某项目当前写到哪一章 / Block / 钩子」  
2. 「继续写第 XX 章」或指定 `explore` / `publish`

### 改稿（已有原文）

- 明确任务类型为 **改写**。  
- 说明目标维度（爽点、节奏、文风、降 AI 味等）。  
- 输出须含：**原文 → 改写 → 改动理由**

---

## 使用示例（对话形态）

```
用户：帮我开一本 500 万字的仙侠长篇，主角是被逐出宗门的剑修。

[agent]
→ 读根 SKILL.md → 识别为「新书 + 长篇」
→ memory · INIT(project_root=./剑修逐出)
→ story-blueprint … → 灌入 book.yaml / fingerprint.md / characters/* / arcs / bible/*
→ plot-design 出开头若干章骨架
→ plot-design · draft_prose(target_chapter=1)
   ├─ LOAD
   ├─ DRAFT（prompt 内含 25 项硬约束摘要）
   ├─ VERIFY
   └─ PERSIST → 第 1 章终稿与状态更新
→ 循环后续章节
```

```
用户：把第 87 章拿出来体检。

[agent]
→ 读根 SKILL.md → pitfalls
→ 读 chapters/ch0087_*.md、state/chapter_meta/ch0087.yaml、相关 state/*
→ Part A + Part B 诊断
→ 诊断卡 + 最小修复路径
```

---

## 兼容性

- OpenClaw ClawHub / Hermes：原生支持。  
- 符合 AgentSkills 的客户端：可把本仓库挂成 skill。

## 许可与来源

代码与模板为本仓库撰写；最终以仓库内的 **LICENSE** 为准（若无则默认作者保留权利）。
