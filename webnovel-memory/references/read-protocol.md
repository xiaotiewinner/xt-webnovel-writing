# 读取协议 · 生成任何新章节之前必须执行

下游 skill（`webnovel-plot-design` 的正文模式、`webnovel-excitement-and-craft` 的加爽/改写）在启动前调用本协议，拉齐**最小必要上下文**，避免长篇失忆。

## 输入

```yaml
project_root: <作品根目录绝对路径>
target_chapter: <要生成或改写的章号>
mode: draft | revise | diagnose
```

## Phase 1 · 常驻上下文（永远读）

按以下顺序读，全部加载后预计 ≤ 4000 字上下文占用：

1. `book.yaml` → 书籍元数据
2. `fingerprint.md` → 作者指纹（风格锁定）
3. `bible/power-system.md` + `bible/glossary.md` → 避免设定自相矛盾
4. `state/foreshadow.md`（只取 `live` 行） → 不能遗忘的伏笔
5. `state/used-excitement.md`（最近 10 行，含 `interruption` 列） → 避免同类爽点堆叠 + 抽取本章必须使用的打断类型
6. `state/used-patterns.md` → 当前禁用句式 / 动词清单 + 反 AI 味监控面板最近 3 章状态（主语分布 / 段长熵 / 非理性噪声 / 质量方差 / 反派套餐 / 灵魂渗透缺位名单 / 动物独立反应缺位名单）
7. `state/power-level.md` → 主角当前修为状态
8. `state/open-threads.md` → 未收束矛盾

## Phase 2 · 当前 arc 上下文

1. 从 `arcs/_index.md` 查 `target_chapter` 所属 arc
2. 读该 arc 文件（矛盾 / 八步位置 / 已写到第几步）
3. 根据八步位置，决定本章承担步骤

## Phase 3 · 相邻章节上下文

1. 读 `index/chapter-log.md`，取 `target_chapter - 3` 到 `target_chapter - 1` 共 3 条摘要
2. 读 `chapters/<target_chapter - 1>.md` 的 frontmatter（不读正文，只取 hooks_planted / characters / locations）
3. 若 `target_chapter - 1` 的 `hooks_planted` 非空，本章必须至少承接 1 条

## Phase 4 · 相关角色按需加载

1. 从 Phase 3 拿到 `characters` 列表
2. 读 `characters/_index.md` 定位文件路径
3. 每个角色读 frontmatter + "当前修为" + "最近状态" + **"灵魂字段 soul_fields"** + "灵魂渗透记录 soul_bleed_log 最近 3 行"；不读完整历史
4. 若本章将首次引入新角色，跳过此步，但在 Phase 5 写入时创建新人物卡并强制要求 `soul_fields` 至少非空 1 条（反 O）
5. 若角色为动物 / 灵兽 / 灵物（species != 人），额外加载其"独立反应坐标轴"字段

## Phase 5 · 检索型查询（可选，按生成需要）

当 agent 生成过程中不确定：
- 某人物最后一次出场在哪章 → 查 `index/by-character.md`
- 某地点上一次出现 → 查 `index/by-location.md`
- 某法宝/功法上一次提到 → 查 `index/by-item.md`
- 某专有名词是否已存在（避免误撞同名） → 查 `bible/glossary.md`

## Phase 6 · 加载公共 references

1. `../../references/anti-ai-tells.md` → 反 AI 味 15 主条款 + 4 扩展子条款
2. `../../references/foxsan-webnovel-manual.md` → 方法论底本

## 上下文装填模板

Phase 1–4 的结果在进 prompt 前压成下列结构，而不是原样塞入：

```markdown
## 记忆快照 · 第 N 章

### 书籍常量
- 书名 / 类型 / 主角 / 主线 L1 / 作者指纹（浓缩 3 行）

### 当前 arc
- arc-NN · 矛盾句 · 现在处于八步的第 X 步

### 必须承接
- 第 N-1 章钩子：<原话 1 句>
- 当前 live 伏笔（top 3）：
  - F-001 · 埋于第 X 章 · 预期兑现 <范围>

### 必须规避
- 禁用句式（10 章内已过量）：<列出>
- 禁用爽点类型（最近 3 章已用 2 次以上）：<列出>
- 禁用设定冲突：<从 glossary 挑 5 条相关名词列出正确定义>

### 反 AI 味强制输入（来自 used-patterns.md，本章必须遵守）
- 主语分布：本章 top-1 主语段占比 **必须 ≤ X%**（上一章命中 Y%）
- 段长熵：段长标准差 **必须 ≥ 8**；**至少 3 段 > 100 字**（上一章只有 N 段）
- 非理性噪声：**所有 ≥ 300 字主角思考段必须各含 ≥ 1 条**（误判 / 走神 / 情绪干扰 / 杂念 / 非最优选择）
- 质量方差：本章成稿后**必须挑 1 段亮化 + 1 段回退粗化**；段落具象度方差必须 ≥ 0.8
- 反派 signature：本章出现的反派 NPC 的标准套餐命中 ≤ 2，signature 反应命中 ≥ 2；引用 `characters/<反派>.md` 的 signature_reactions 字段
- 爽点打断：本章每条爽点必须预先标注 delay / denied / cost 之一，并在正文中兑现
- **灵魂渗透（反 O）**：本章出场 ≥ 3 次的**每个**有名角色，必须至少 1 处非功能性灵魂渗透；上一章"纯功能性角色名单"中的角色 → 本章强制兑现
- **动物独立反应（反 O · species != 人）**：本章动物 / 灵兽段落不得 100% 服务于主角意图；上一章若出现纯工具化 → 本章必须补 1 处独立行动

### 活跃角色当前状态 + 灵魂字段（必入 prompt，反 O）
- 叶无尘：金丹中期；情绪 = 冷静；位置 = 天剑峰；**soul_fields**：core_wound = "师妹挡剑那事"；private_desire = "再去一次北境看雪"
- 柳长风：重伤；情绪 = 怨恨；位置 = 宗门后殿；**signature_reactions**：<2 条从卡上摘>；**soul_fields**：第三维度 = "每月初一去一座无名坟前坐半个时辰"
- 小焰（灵兽）：非本能偏好 = "只听竹笛声才会停下"；async_emotion = "主角紧张时它盯飞虫"

**装填规则**：每个有名角色必须至少渲染 1 条 soul_fields 进 prompt；动物 / 灵兽必须至少渲染 1 条独立反应坐标轴。Agent 在正文中必须"让这条灵魂字段被偶然看见"（不推动剧情、不解释、不兑现）。

### 作者指纹（全文生成必须贴合）
- 动词偏好：...
- 物象偏好：...
- 断句偏好：...
```

## 缓存规则

- Phase 1 + 2 的内容在同一会话内可缓存；`book.yaml` 或 `fingerprint.md` 被修改 → 失效
- Phase 3 + 4 每次生成新章前都必须重读（会频繁更新）
- Phase 5 是按需查询，不缓存

## 失败降级

| 缺文件 | 降级方式 |
|---|---|
| `book.yaml` 不存在 | 拒绝生成；引导用户先跑 `webnovel-story-blueprint` |
| `fingerprint.md` 不存在 | 允许生成但警告"作品将无作者指纹"；生成完强烈建议补卡 |
| `state/*` 任一缺失 | 即时创建空文件继续 |
| `index/chapter-log.md` 缺失 | 从 `chapters/*.md` 扫 frontmatter 全量重建 |
| `arcs/_index.md` 缺失 | 视为处于默认 arc；提示用户补 arc 划分 |
