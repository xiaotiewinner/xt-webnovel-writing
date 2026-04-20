# xt-webnovel-writing

中文网络小说写作 agent —— 一个 OpenClaw / ClawHub skill。整个仓库就是一个 skill：根 `SKILL.md` 是唯一入口，内部由 6 个 `workflow.md` 模块组成完整的网文生成流水线，覆盖：参考文本拆解 → 立书 → 剧情设计 → 爽点与文笔 → 反 AI 味体检 → 长篇持久化记忆。

- 所有文案、模板、交付物默认**全中文**。
- 内置 15 主条款 + 4 扩展子条款「反 AI 味」硬约束，覆盖句式复用、主语熵、反应套餐、定义体、算法思维链、爽点链条过完整、质量曲线过稳定、**角色灵魂缺位**等"另一台模型才能抓出的深层指纹"。
- **角色必有"灵魂"**：所有有名字的角色（含动物 / 灵兽 / 反派 / 路人）都必须有自己的核心创伤 / 私人欲望 / 私下信念 / 怪癖，并在出场时被"偶然看见"一次；不允许只为剧情功能存在的空心 NPC。
- 长篇场景（≥ 100 万字 / ≥ 200 章）有完整的磁盘持久化记忆系统，解决 AI 写长篇的失忆、设定漂移、伏笔遗忘、修为前后矛盾、**角色灵魂蒸发**等问题。

## 目录结构

```
xt-webnovel-writing/                    ← OpenClaw skill 根（唯一入口）
├── SKILL.md                            ← 主入口 · 角色 / 公理 / 路由 / 全流程
├── README.md                           ← 本文件
├── .clawhubignore
├── references/                         ← 全 skill 共享
│   ├── anti-ai-tells.md                ← 反 AI 味 15 主 + 4 扩展子条款（含 O · 角色灵魂缺位）
│   └── foxsan-webnovel-manual.md       ← 方法论底本
├── webnovel-text-analysis/
│   └── workflow.md                     ← 拆解已有文本，提取风格指纹
├── webnovel-story-blueprint/
│   └── workflow.md                     ← 主线/人设/书名/大纲/简介/作者指纹
├── webnovel-plot-design/
│   └── workflow.md                     ← 剧情结构 · 八步节奏 · 章节正文草案
├── webnovel-excitement-and-craft/
│   └── workflow.md                     ← 爽点生成 + 四层文笔改写（含反 AI 味层）
├── webnovel-pitfalls/
│   └── workflow.md                     ← 双路体检：结构 10 项 + 反 AI 味 15 主 + 4 扩展
└── webnovel-memory/                    ← 长篇记忆系统（磁盘即记忆）
    ├── workflow.md
    └── references/
        ├── directory-schema.md         ← 项目目录与字段模板
        ├── read-protocol.md            ← 生成前 LOAD 协议
        └── write-protocol.md           ← 生成后 PERSIST 协议
```

**关于结构的说明**：按 OpenClaw 官方规范，一个 skill = 一个目录 + 一个 `SKILL.md`。本仓库作为一个 ClawHub slug 发布，所以只有根 `SKILL.md` 会被识别为 skill；各子目录的 `workflow.md` 是根 SKILL.md 按需加载的**内部模块**，不是独立 skill，不会被 ClawHub 额外索引。

## 能力速览

根 `SKILL.md` 按关键词路由到内部模块：

| 场景 | 路由目标模块 |
|---|---|
| 分析 / 拆这段 / 学这种风格 / 模仿 | text-analysis |
| 定主线 / 起书名 / 写人设 / 大纲 / 简介 | story-blueprint |
| 写开头 / 前几章 / 剧情节奏 / 写正文 / 续写 | plot-design |
| 不够爽 / 爽点 / 改文笔 / 画面感 / 去 AI 味 | excitement-and-craft |
| 检查 / 点评 / 自检 / AI 味 / 哪里不对 | pitfalls |
| 续写 / 接着写 / 上次写到 / 长篇项目初始化 | memory |

## 七条公理（全套共享）

1. 矛盾 → 剧情 → 爽点。倒挂就重写。
2. 主角第 1 章前 200 字内必须出场并产生动作。
3. 主角必有明显且持续生效的缺点。
4. 书名必须映射到一个具体的第一个爽点。
5. 反 AI 味 15 主条款 + 4 扩展子条款全部 PASS 才算生成成功；M（爽点链条过完整）、N（质量曲线过稳定）、**O（角色灵魂缺位）** 为元层级硬门。
6. **角色灵魂硬门**：所有有名字且出场 ≥ 3 次的角色（主角 / 配角 / 反派 / 动物 / 灵兽 / 法宝拟人）必须有 soul_fields（与剧情功能无关的内部状态）；每次出场必须有至少 1 处非功能性灵魂渗透。
7. 长篇（≥ 100 万字或 ≥ 200 章）必须走 memory · LOAD/PERSIST，绕过视为违规。
8. 短句 + 画面感 + 共鸣是文笔基线，辞藻华丽不是目标。

## 反 AI 味能力

针对"另一台大模型就能抓出来的 AI 味"，skill 内置 **15 主条款 + 4 扩展子条款**，并在生成阶段与诊断阶段双路执行。条款来源于外部大模型（ChatGPT / Claude）对同一段 AI 生成网文的**四轮联合诊断**反推得出（第 4 轮补了 O · 角色灵魂缺位，盯的是"每个有名存在是不是一个主体"）：

| # | 条款 | 生成期规避 | 诊断期信号 |
|---|---|---|---|
| A | 节拍器式推进 | 每 3–5 段插入无回报铺垫 | 连续 ≥ 5 段都可被打功能标签 |
| B | 句式与语义复用 | 重复句式 ≥ 2 次必换写 | 10 章内同句式 ≥ 10 次 |
| **B-扩展** | 主语单调 / 句长熵过低 | top-1 主语段占比 ≤ 40%，段长标准差 ≥ 8 | "他"开头段 ≥ 40% 且段长匀速 |
| C | "第 X 剑"节奏病 | 禁止纯递增单句成段 | 单句成段 ≥ 4 连 |
| D | 信息密度过干净 | 每 300 字一句可删的非功能描写 | 段段都有功能 |
| E | 情感标签化 | 每形容词必须跟动作 / 生理反应 | 只有"冷静"没有证据 |
| **E-扩展** | 反应套餐化 | 反派卡必填 ≥ 2 条 signature；禁止"脸色/冷汗/胸口/沉默/'不可能'"标准套餐 | 反派段内标准套餐命中 ≥ 3 |
| F | 修为清单化 | 等阶嵌场景 + 代价，不独段 | 独立成段只写数字 |
| G | 设定说明书化 | 一次只透一条，通过体感带出 | "XX——YY。" 列表 |
| **G-扩展 1** | "是/不是/而是" 定义体 | 禁用定义排比；体验式 / 他人转述 / 残缺式 | 出现"不是 X，而是 Y"或"X，意味着——Y" |
| **G-扩展 2** | 三项并列打包讲解 | ≥ 3 项体系内容拆到 ≥ 3 章 | 同章讲体系 ≥ 3 项并列 |
| H | 最优解战斗 | 必植入干扰变量 + 战场外感官 | 全程完美无失误 |
| **H-扩展** | 算法式思维链 | 主角思考段必含 ≥ 1 条非理性噪声（误判/走神/情绪/杂念/非最优） | 思考段压成"观察→判断→调整→成功"四步无噪声 |
| I | 对话功能过载 | 换角色说同样行 → 重写 | 对话互换后无差别 |
| J | 套路节点密度过高 | 单章 ≤ 2 个类型节点 | 单章 ≥ 4 个节点 |
| K | 段长分布畸形 | 段长呈短/中/长阶梯 | 全章无 > 80 字段落 |
| L | 作者指纹缺位 | 强制 fingerprint.md 贴合 | 纯书面语无个人怪癖 |
| **M** | 爽点链条过完整 | 每条爽点必标 delay / denied / cost 打断点，当章兑现 | 章末 5 条爽点验证全 PASS 且无打断 |
| **N** | 质量曲线过稳定 | 每 2000–3000 字一次风格偏差；成稿后 1 段亮化 + 1 段回退粗化 | 全章找不到"明显差的一句"也找不到"明显亮的一句" |
| **O** | 角色灵魂缺位 / 功能性存在 | 每个有名角色必填 ≥ 1 条 soul_fields（core_wound / private_desire / contradictory_belief / unreasonable_preference）；动物必填独立反应坐标轴；反派必填第三维度；每章出场 ≥ 3 次则至少 1 处"非功能性渗透" | 多数角色只剩功能；反派仅"想赢 / 恨主角"；动物纯工具化；配角台词可互换 |

完整内容：`references/anti-ai-tells.md`。

**两条关键洞察**：
1. 最隐蔽的**语言层** AI 指纹是 **"太稳定地优秀"** —— 从头到尾维持同一质量曲线、主语匀速、段长匀速、情感反应模板化、爽点链条零打断、思考全程理性无噪声。M 和 N 两条就是为这个"元层级指纹"兜底的硬门。
2. 最隐蔽的**叙事层** AI 指纹是 **"人都像纸做的"** —— 每个角色只为剧情功能活着，没有属于自己的、与剧情无关的内部状态。动物只会预警救主，反派只有恨主角，路人甲可互换路人乙。O 条款就是为这个"主体性指纹"兜底的硬门；memory 模块会跨章监控每个有名角色的灵魂渗透缺位，连续 2 章缺位就把下一章该角色的灵魂渗透升级为回滚级硬门。

## 长篇记忆系统（memory 模块）

目标规模：500 万字 / 6000 字每章 / ~830 章。

**标准化项目目录**（agent 第一次接触时自动创建）：

```
<project_root>/
├── book.yaml                  书籍元数据
├── fingerprint.md             作者指纹（风格锁定）
├── bible/                     世界观圣经（静态设定）
├── characters/                人物卡（一人一文件）
├── arcs/                      剧情弧
├── chapters/                  正文章节（每章独立文件）
├── state/                     动态状态（伏笔表 / 时间线 / 关系 / 修为 / 已用爽点 / 已用句式 / 未收束矛盾）
└── index/                     倒排索引（人物 / 地点 / 物品 / 章节摘要）
```

**工作流程**（每一章闭环）：

```
[用户]  写第 N 章
  ↓
[memory · LOAD]  拉出 ≤ 4000 字"记忆快照"：
  · book.yaml / fingerprint.md
  · 当前 arc 八步位置
  · 前 3 章摘要 + 第 N-1 章钩子
  · live 伏笔（top 3–5）
  · 活跃角色当前状态 + signature_reactions + **soul_fields（反 O 必现清单）**
  · 动物 / 灵兽独立反应坐标轴 + 上一章"纯功能性角色名单" / "动物纯工具化名单"
  · 禁用句式 / 禁用爽点类型 / 禁用反派套餐词
  · 反 AI 味监控面板摘要（主语分布 / 段长熵 / 非理性噪声覆盖率 / 质量方差 / 爽点打断类型 / 灵魂渗透缺位）
  ↓
[plot-design · draft_prose]  把快照 + anti-ai-tells 全部嵌入 prompt
  ↓
[反 AI 味 A–O 主条款 + 4 扩展子条款 自检]  任一 FAIL 则重写；M / N / O 为元层级硬门
  ↓
[memory · PERSIST]  7 步落盘：
  · chapters/<N>.md + frontmatter
  · index/chapter-log.md 摘要
  · state/foreshadow.md 伏笔表
  · state/used-excitement.md / used-patterns.md 防重复日志
  · state/timeline.md / power-level.md
  · characters/<name>.md 每个在场角色的最新状态
  · arcs/<cur>.md 当前 arc 八步位置
  ↓
[一致性检查]  伏笔 / 修为 / 名词 / 爽点 / 场景 全部交叉验证
  ↓
[交付用户]
```

**周期性审计**：每写完 10 章，可要求跑 memory · AUDIT，自动发现：
- 超 100 章仍 live 的伏笔
- 无理由降级的修为
- 未入词典的专有名词
- 最近 20 章某单一爽点类型占比 > 40%
- 最近 20 章某单一打断类型占比 > 60%
- 最近 10 章全局主语 top-1 平均占比 > 35%
- 最近 10 章全局段长方差 / 具象度方差持续偏低（整书质量曲线过稳）
- 最近 10 章非理性噪声全局覆盖率 < 100%（整书算法味）
- 索引与章节 frontmatter 不一致

## 安装

### 通过 ClawHub（推荐）

在你的 OpenClaw 工作区根目录：

```bash
openclaw skills install xt-webnovel-writing
```

安装后 OpenClaw 会把本仓库内容放到 `<workspace>/skills/xt-webnovel-writing/` 下，根 `SKILL.md` 自动挂载。

### 手动安装

把整个 `xt-webnovel-writing/` 目录放到任一 OpenClaw skill 搜索路径（按加载优先级从高到低）：

- `<workspace>/skills/xt-webnovel-writing/`
- `<workspace>/.agents/skills/xt-webnovel-writing/`
- `~/.agents/skills/xt-webnovel-writing/`
- `~/.openclaw/skills/xt-webnovel-writing/`

开新会话，OpenClaw 即会识别根 `SKILL.md`。

验证：

```bash
openclaw skills list
# 应能看到 xt-webnovel-writing
```

### 作为 Claude Code / 其他兼容 AgentSkills 的 agent

OpenClaw skill 与 [AgentSkills](https://agentskills.io) 规范兼容，任何支持 AgentSkills 的 agent 均可把本目录挂为 skill 根。

## 使用示例

```
用户：帮我开一本 500 万字的仙侠长篇，主角是被逐出宗门的剑修。

[agent]
→ 读根 SKILL.md → 识别为"新书+长篇"
→ memory · INIT(project_root=./剑修逐出)
→ story-blueprint 跑完 6 步，把结果灌入
   book.yaml / fingerprint.md / characters/* / arcs/arc-01-*.md / bible/*
→ plot-design 出开头 5 章骨架，落进 arc-01
→ plot-design · draft_prose(target_chapter=1)
   ├─ LOAD → 记忆快照（3200 字，含 soul_fields 必现清单）
   ├─ DRAFT（反 AI 味 15 主 + 4 扩展 硬嵌 prompt）
   ├─ SELF-CHECK PASS（含 O · 角色灵魂渗透硬门）
   └─ PERSIST → 第 1 章落盘 + 所有状态表更新 + soul_bleed_log
→ 交付用户，循环到第 2 章
```

```
用户：把之前写的第 87 章拿出来体检。

[agent]
→ 读根 SKILL.md → 路由到 pitfalls
→ 读 chapters/0087.md + 相关 state/*
→ Part A 结构 10 项 + Part B 反 AI 味 15 主 + 4 扩展子条款（含 O · 角色灵魂缺位）
→ 产出诊断卡 + 最小修复建议
```

## 兼容性

- OpenClaw Agent / ClawHub：原生支持
- 任何遵循 AgentSkills 规范的 agent（Claude Code / Claude.ai 等）：可直接挂载

## 许可与来源

- 代码 / 模板：本仓库自撰；按仓库 LICENSE（若缺省则视为作者保留权利）。
