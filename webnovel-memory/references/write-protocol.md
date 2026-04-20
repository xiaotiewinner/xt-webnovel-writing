# 写入协议 · 每次生成完新章之后必须执行

生成完一章正文后，agent 必须按此协议把状态固化到磁盘。**写入失败则视为生成失败**，该章不交付。

## 输入

```yaml
project_root: <绝对路径>
chapter_number: 87
chapter_title: 一剑破阵
chapter_body: <新生成的正文>
chapter_meta:
  arc: arc-03-夺剑
  pov: 叶无尘
  locations: [天剑宗演武场, 天剑宗后殿, 天剑峰]
  characters_present: [叶无尘, 柳长风]
  excitement_types: [REV, ID, PWR]
  plot_nodes: [破阵, 夺宝, 升级]
  hooks_planted:
    - id: F-012
      text: 其他三大宗门将联手围攻天剑宗
      expected_payoff: 约 100 章
    - id: F-013
      text: 天剑诀终章「以血祭剑」
      expected_payoff: 终章附近
  hooks_resolved:
    - id: F-005
      note: 天剑诀中/下卷夺回
  power_changes:
    - character: 叶无尘
      from: 金丹初期
      to: 金丹中期
  new_characters: []           # 本章首次出场的角色
  new_locations: []
  new_items: [无生剑]
  new_glossary: []
  summary: <章节摘要 200-400 字>
  # —— 以下字段反 AI 味强制要求（与 anti-ai-tells.md 联动） ——
  excitement_interruption:                 # 反 M：爽点链条打断点（每条爽点一条）
    - type: REV
      interruption: cost                   # delay | denied | cost
      evidence: 剑骨内伤、剑气消耗殆尽
    - type: ID
      interruption: delay
      evidence: 中卷到手但未立即翻开
    - type: PWR
      interruption: cost
      evidence: 三天闭关体力透支
  stats:                                    # 反 B-扩展 / H-扩展 / N
    top_subject_ratio: 0.35                 # top-1 主语段占比
    subject_top1: 叶无尘
    para_length_std: 14                     # 段长标准差
    long_paras_over_100: 3                  # > 100 字长段数
    thought_blocks: 2                       # ≥ 300 字主角思考段数
    thought_blocks_with_irrational_noise: 2 # 其中含非理性噪声的段数
    concreteness_variance: 1.5              # 段落具象度方差
    bright_lines: 2                         # 明显亮句数
    rough_lines: 1                          # 明显粗糙句数
  antagonist_reactions:                     # 反 E-扩展
    - name: 柳长风
      template_hits: 2                      # 标准套餐（脸色/冷汗/胸口/沉默/"不可能"）命中数
      signature_hits: 2                     # signature_reactions 命中数
  soul_bleed:                               # 反 O：每个有名出场 ≥ 3 次角色的灵魂渗透记录
    - name: 叶无尘
      appearances_in_chapter: 8
      bleed_count: 2                         # 非功能性渗透次数
      bleed_fields: [core_wound]             # 本章渗透涉及的灵魂字段
      bleed_evidence: ["写剑决前停手揉了揉虎口——师妹当年被剑气伤过同一处"]
    - name: 柳长风
      appearances_in_chapter: 4
      bleed_count: 1
      bleed_fields: [third_dimension]
      bleed_evidence: ["动手前揉了揉右手腕，是从未提起过的旧伤"]
  animal_independence:                       # 反 O · species != 人
    - name: 小焰
      appearances_in_chapter: 3
      independent_actions: 2                 # 与主角指令无关的反应次数
      evidence: ["主角焦虑时它盯着一只飞虫看很久"]
```

## 七步落盘（必须按顺序，不允许跳步）

### STEP 1 · 写章节本体

1. 写 `chapters/<NNNN>.md`
2. YAML header 按 [directory-schema.md §章节模板] 填充
3. 正文即 `chapter_body`

### STEP 2 · 追加章节摘要

1. 追加一条到 `index/chapter-log.md`：

```markdown
## 第 87 章 · 一剑破阵
- arc：arc-03-夺剑
- 出场：叶无尘 / 柳长风
- 爽点：REV + ID + PWR（下一章禁用 PWR）
- 本章钩子：柳长风联合外宗围攻
- 摘要：<200-400 字>
```

### STEP 3 · 更新倒排索引

1. `index/by-character.md`：对 `characters_present` 每个名字追加 `<chapter>`
2. `index/by-location.md`：对 `locations` 每个追加 `<chapter>`
3. `index/by-item.md`：对 `new_items` 追加 `<chapter>`，非新物品也追加
4. `bible/glossary.md`：把 `new_glossary` 条目补入

### STEP 4 · 更新伏笔表（`state/foreshadow.md`）

1. 对每个 `hooks_resolved.id`：定位该行，状态改 `used`，填兑现章
2. 对每个 `hooks_planted`：追加新行，状态 `live`，填预期兑现范围
3. 扫描所有 `live` 行，若 `chapter_number - 埋点章 > 100` 且仍 live → 状态改 `expired`，同时追加到 `state/open-threads.md`

### STEP 5 · 更新状态表

1. `state/timeline.md`：追加 `第 87 章 · <故事内时间> · <一句话事件>`
2. `state/power-level.md`：按 `power_changes` 更新主角和主要角色修为
3. `state/relationships.md`：如本章有关系变化（敌 / 友 / 暧昧 / 师徒 …），更新相关行
4. `state/used-excitement.md`：追加 `| 87 | REV+ID+PWR | 柳长风 | cost | 剑骨内伤 |` 并**重算禁用规则**：
   - 最近 3 章中某类爽点 ≥ 2 次 → 标记 "下一章禁用 X"
   - 每条记录**必须填 `interruption`**（从 `chapter_meta.excitement_interruption` 读取）。缺失或 `None` → 回滚写入（触发反 M）
   - 连续 3 章 `interruption` 同一种类 → 在状态里标记 "下一章必须换另两种之一"
5. `state/used-patterns.md`：用 `chapter_meta.stats` + 本章正文扫描结果同时写入下列面板（反 B / B-扩展 / H-扩展 / N）：
   - **句式面板**：扫 `chapter_body` 统计高频句式/动词，追加近 10 章滑窗；超阈值句式标记 "下一章禁用"
   - **主语分布面板**：写入 `top_subject_ratio` / `subject_top1` / 省略主语段占比；top-1 > 40% → 标记 "下一章 top-1 主语段占比必须 ≤ 30%"
   - **段长熵面板**：写入 `para_length_std` / `long_paras_over_100`；std < 8 或长段 < 2 → 标记 "下一章强制补 ≥ 3 段长段"
   - **非理性噪声面板**：`thought_blocks_with_irrational_noise / thought_blocks` < 100% → 标记 "下一章所有 ≥ 300 字思考段必须含非理性噪声"
   - **质量方差面板**：写入 `concreteness_variance` / `bright_lines` / `rough_lines`；方差 < 0.8 或亮句/粗糙句缺失 → 标记 "下一章成稿后强制挑 1 段亮化 + 1 段回退粗化"
   - **反派套餐面板**：写入 `antagonist_reactions[*].template_hits / signature_hits`；`template_hits > 2` 或 `signature_hits < 2` → 标记 "下一章该反派场景强制替换 ≥ 2 项为 signature"
   - **灵魂渗透面板（反 O）**：写入 `soul_bleed[*]`；对所有 `appearances_in_chapter ≥ 3` 的角色，若 `bleed_count == 0` → 加入"纯功能性角色名单"并标记 "下一章强制为该角色安排 ≥ 1 处非功能性灵魂渗透"；连续 2 章纯功能 → 升级为硬门（下一章不达标则不允许落盘）
   - **动物独立反应面板（反 O · species != 人）**：写入 `animal_independence[*]`；若 `independent_actions / appearances_in_chapter < 0.5` → 标记 "下一章该动物 / 灵兽必须有 ≥ 1 处与主角指令无关的独立行动"
6. `state/open-threads.md`：把本章出现的新矛盾/疑团加入列表；把本章收束的从列表中移除

### STEP 6 · 更新人物卡

1. 对 `characters_present` 每个角色：
   - 打开 `characters/<name>.md`
   - `last_chapter` 更新为 `chapter_number`
   - 出场章号列表追加 `chapter_number`
   - 若有修为变化 → 更新"当前修为"并追加历史轨迹一行
   - 更新"最近状态"（情绪 / 位置 / 下一步目标）
   - **追加"灵魂渗透记录 soul_bleed_log"一行**（反 O）：章号 / 出场段数 / 渗透次数 / 涉及的灵魂字段 / 是否达标（`appearances_in_chapter ≥ 3` 且 `bleed_count ≥ 1` → ✓；否则 ✗）
2. 对 `new_characters`：
   - 新建 `characters/<name>.md`（使用模板）
   - 在 `characters/_index.md` 追加一行
   - **强制校验**：新人物卡的 `soul_fields` 至少非空 1 条（反 O）；若 `species != 人` → 强制填 ≥ 1 条独立反应坐标轴；若 `role == 反派` → 强制填第三维度。**任一空缺 → 本章整体写入失败回滚**，提示上游 agent 补足人物卡再重来。

### STEP 7 · 更新 arc 文件

1. 打开 `arcs/<current-arc>.md`
2. 更新"已写章节范围"
3. 更新"当前八步位置"
4. 若本章达到 arc 第 8 步（结局） → 标记 arc 为 `closed`，在 `arcs/_index.md` 更新状态

---

## 一致性检查（写完最后一步后自动跑）

1. `chapter_body` 中提到的所有专有名词 → 必须在 `bible/glossary.md` 中存在，否则列警告
2. `power_changes` 与正文内容对齐：正文必须至少有一处体现修为变化（反 AI 味 §F）
3. `hooks_planted` 每条必须能在正文中找到对应伏笔句（给出引用片段）
4. `hooks_resolved` 每条必须能找到兑现场景
5. `excitement_types` 中每个代号必须在正文中找到落字证据
6. **反 AI 味硬门（八选全，任一失败即回滚）**：
   - `excitement_interruption` 每条 `interruption` 字段 ∈ {`delay`, `denied`, `cost`}（反 M）
   - `stats.top_subject_ratio` ≤ 0.4（反 B-扩展）
   - `stats.para_length_std` ≥ 8 且 `stats.long_paras_over_100` ≥ 2（反 B-扩展 / K）
   - `stats.thought_blocks_with_irrational_noise / max(1, stats.thought_blocks)` == 1.0（反 H-扩展）
   - `stats.concreteness_variance` ≥ 0.8 且 `bright_lines ≥ 1` 且 `rough_lines ≥ 1`（反 N）
   - 每个 `antagonist_reactions` 条目：`template_hits ≤ 2` 且 `signature_hits ≥ 2`（反 E-扩展）
   - **每个 `soul_bleed` 条目（`appearances_in_chapter ≥ 3`）：`bleed_count ≥ 1`（反 O）；上一章已被标为"纯功能性"的角色本章仍 `bleed_count == 0` → 强制硬失败**
   - **每个 `animal_independence` 条目：`independent_actions / appearances_in_chapter ≥ 0.5`（反 O · species != 人）**

任一失败 → 回滚写入，报错给上游 agent，要求重写后再 PERSIST。

## 并发与锁

- 同一 `project_root` 一次只允许一个写入者
- 写入前创建 `.webnovel-memory/write.lock`；写完删除
- 若锁超过 5 分钟未释放视为残留，可强制清除

## 版本化（可选）

- 若 `project_root` 是 git 工作区，每次成功落盘后建议 `git add . && git commit -m "chapter <N>"`
- 本 skill 不自动 commit，由用户或上层 agent 触发

## 回滚

当用户说"这一章不要了" / "回退一章"时：

1. 读 `.webnovel-memory/last-write.json` 找到上次写入的文件清单
2. 对每个文件用 `git checkout HEAD~1 <file>` 或读取 `.webnovel-memory/backup/<chapter>/` 还原
3. 从 `chapter-log.md` 删除该章摘要
4. 从 `index/by-*.md` 删除该章号
5. 从 `foreshadow.md` 撤销本章相关状态变更
6. 删除 `chapters/<NNNN>.md`

这就要求 STEP 1–7 开始前**备份所有将改动的文件副本到 `.webnovel-memory/backup/<chapter>/`**。
