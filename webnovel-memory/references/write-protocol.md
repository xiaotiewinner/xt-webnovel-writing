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
      evidence: 中卷到手了，但没有立即翻开
    - type: PWR
      interruption: cost
      evidence: 三天闭关体力透支
  stats:                                    # 反 B-扩展 / H-扩展 / N / C / K / E / G+1 / N-细
    top_subject_ratio: 0.35                 # top-1 主语段占比
    subject_top1: 叶无尘
    para_length_std: 14                     # 段长标准差
    long_paras_over_80: 4                   # > 80 字长段数（反 K）
    long_paras_over_120: 1                  # > 120 字长段数（反 K · 其中 ≥ 1 段）
    single_sentence_para_ratio: 0.28        # 单句成段占比（反 C / K · 需 ≤ 0.3）
    single_sentence_run_max: 2              # 最长连续单句成段段数（反 C · 需 ≤ 2）
    single_sentence_run_clusters: 0         # 全章 ≥ 3 段的单句段丛数（反 C · 需 ≤ 2）
    thought_blocks: 2                       # ≥ 300 字主角思考段数
    thought_blocks_with_irrational_noise: 2 # 其中含非理性噪声的段数
    concreteness_variance: 1.5              # 段落具象度方差
    bright_lines: 2                         # 明显亮句数
    rough_lines: 1                          # 明显粗糙句数
    definition_style_hits: 1                # 反 G+1 · 9 种定义体模板命中总次数（需 ≤ 2）
    definition_style_templates: ["不是 A 是 B"]  # 命中的模板清单
    bold_total: 1                           # 全章粗体数（反 N-细 · 需 ≤ 1）
    bold_for_theme_emotion: 0               # 粗体用于情绪 / 主题 / 内心独白 / 点题（反 N-细 / E · 需 = 0）
    emotion_token_solo_paragraphs: 0        # 情绪词（名词 / 两字词）+ 句号 + 独段次数（反 E · 需 ≤ 1）
    emotion_token_bold: 0                   # 情绪词 + 粗体次数（反 E · 需 = 0）
    setting_reveal_overload_hits: 0         # 设定首次出现即在单次发言带 ≥ 3 项结构性信息的次数（反 G-细 · 需 = 0）
    signature_ming_pai_hits: 1              # 同一 signature 被明文指认 + 解读的次数（反 E+2 · 需 ≤ 1）
    # —— D / P / Q 新增统计（2026-04） ——
    filler_count: 7                         # 反 D-1 · 闲笔段数（需 ≥ 5）
    filler_unresolved_count: 3              # 其中未来 5 章内不回收的（需 ≥ 2）
    side_char_autonomous_agenda_count: 1    # 反 D-2 · 配角自主议题条数（需 ≥ 1，每条 ≥ 80 字）
    side_char_autonomous_agenda_names: [王小二]
    choice_mechanism_trigger_count: 0       # 反 D-3 · 本章选择/系统/抽奖触发次数
    choice_mechanism_waste_count: 0         # 其中选"废选项"的次数（每 3 次触发需 ≥ 1）
    weirdness_budget_count: 1               # 反 P-1 · 剧情无法吸收的怪异元素数（需 ≥ 1）
    weirdness_budget_evidence: ["演武场角落一个被画歪的柯基头像"]
    deferred_setup_count: 2                 # 反 P-3 · 5 章内不回收的伏笔/设定数（需 ≥ 1）
    anti_trope_top5_declared: true          # 反 P-4 · 是否在 state/anti-trope-log.md 落盘 5-清单
    anti_trope_actual_rank: 5               # 真实写的接续在 5-清单中的排名（需 ≥ 4 或不在清单里；≤ 3 为 FAIL）
    transition_count: 3                     # 反 Q · 本章场景切换总次数
    transition_types: [Q-1, Q-4, Q-2]       # 每次切换的桥类型（5 类中之一）
    transition_bridge_declared: true        # 每次切换都显式声明了桥类型与锚点
    forbidden_transition_words_hits: 0      # 反 Q · 禁用转场词命中次数（需 = 0，≥ 2 → 回滚级 FAIL）
    teleport_transitions: 0                 # 反 Q · "瞬移切换"次数（无任何桥）（需 = 0，≥ 1 → 回滚级 FAIL）
    # —— D-4 人类缀笔 / 反剪辑体（与 D-1 闲笔不同层；见 anti-ai-tells.md） ——
    narration_buffer_marks: 4              # 迟疑/从句套层/而则缀笔等可计意群数（第一/三人称限知为主）
    clip_style_chain_max: 2                 # 比喻或判断短句无顺接连词、句号硬接的连打峰值（需 ≤ 2；≥ 3 → 回滚级 FAIL）
    d4_pov: limited                          # `first` | `limited` | `omniscient` — 全知时 D-4 计数量地板减半
    # —— R / K-补充（2026-04 第 7 轮） ——
    exclusion_enum_hits: 0                  # 反 R-1 · 「不是…不是…是/而是/只剩」生活流双否定目录（需 = 0；≥ 2 → 回滚；=1 且同段 G+1>0 → 回滚）
    tutorial_microstep_chain_max: 3         # 反 R-2 · 单段或无对白 200 字窗内纯动作微步峰值（需 ≤ 4；≥ 5 → 回滚）
    catalog_afterthought_pairs: 0            # 反 R-3 · 「又/再」动作块后接 ≤8 字纯状态验收短句的对数（需 = 0；≥ 1 → 回滚）
    k_scene_block_violations: 0              # 反 K-补充 · 显著时空跳变该空行未空行（需 ≤ 2；≥ 5 → 回滚）
    # —— A-补充 / O-在场（2026-04 第 8 轮，并入 A / O，不增加 25 项计数） ——
    chapter_word_count: 2800                 # 本章正文汉字约数（用于好奇缝隙阈值；可由 agent 数 chapter_body）
    meta_language_hits: 0                    # 反 O-在场 · 「上一章/下一章/本章/读者/作者/弹幕/评论区」等元叙事词命中（需 = 0；≥ 1 → 回滚）
    opening_hook_spike: true                 # 反 A-补充 · 章首 ≈200 字内是否出现「刺点钉子」（非常规关系/动作/物件并置）
    curiosity_gap_markers: 3                 # 反 A-补充 · 全章「具体信息滞后解释」缝隙处数；需 ≥ max(2, chapter_word_count // 1200)
    flat_atmosphere_streak_max: 4            # 反 A-补充 · 连续「纯氛围/纯位移/纯等待」段数峰值（需 ≤ 5；≥ 6 → 回滚）
    series_opening_strike_count: 2           # 反 A-补充 · 首章前500字抓手数（仅 chapter 1 强制；需 ≥ 2）
    opening_question_debt_present: true      # 反 A-补充 · 首章是否留下未全兑付的具体追问债（仅 chapter 1 强制）
    system_prompt_template_hits: 1           # 反 G-补充 · 同构系统提示模板命中（如【X：Y——Z】；需 ≤ 2；≥ 5 → 回滚）
    coincidence_chain_hits: 2                # 反 P-补充 · 连续偶然驱动节点数（需 ≤ 3；≥ 6 → 回滚）
    forced_detour_hits: 0                    # 反 P-补充 · 主角可回头但被叙事强导向单一路径次数（需 ≤ 1；≥ 2 → 回滚）
    tech_jargon_density_per_1k: 5            # 反 G-补充2 · 每千字技术术语数（需 ≤ 8；> 12 → 回滚）
    tech_exposition_block_over_120: 1        # 反 G-补充2 · >120字技术说明段数量（需 ≤ 1；≥ 3 → 回滚）
    tech_mechanism_closure_hits: 0           # 反 G-补充2 · 同段完整触发→过程→结果闭环次数（需 ≤ 1；≥ 2 → FAIL）
    lexeme_cluster_repeat_hits: 2            # 反 B-补充 · 高频抽象词簇复读命中（需 ≤ 3；≥ 7 → 回滚）
    abstract_aura_token_density_per_1k: 7    # 反 B-补充 · 抽象气场词密度/千字（需 ≤ 10；> 18 → 回滚）
    near_duplicate_paragraph_pairs: 0        # 反 B-补充2 · 近重复段落对数（需 = 0；>=1 FAIL；>=2 回滚）
    max_paragraph_similarity: 0.42           # 反 B-补充2 · 章内段落最大相似度（需 < 0.88；>=0.92 回滚）
    duplicate_dialogue_openers: 0            # 反 B-补充2 · 重复对话开场且无信息增量（需 = 0）
    cultural_shorthand_clash_hits: 2           # 反 P-补充2 · 共有文化符号贴进对抗动作并置次数（需 ≥ 1；= 0 → 回滚）
    withhold_beat_present: true               # 反 P-补充2 · 抬高预期后的拒展示/留白收束（需 true；false → FAIL）
    trope_chain_hits: 2                      # 反 P-补充3 · 模板剧情节点命中数（>=4 FAIL）
    trope_chain_max_run: 1                   # 反 P-补充3 · 连续模板节点最长链（>=3 且怪异预算=0 回滚）
    predictability_score: low                # 反 P-补充3 · 低/中/高（high 需重排节拍）
    simile_density_per_1k: 6                 # 反 B-补充3 · 比喻密度（>10 WARN；>14 FAIL）
    simile_cluster_max: 2                    # 反 B-补充3 · 连续比喻峰值（>=4 FAIL）
    simile_pattern_repeat_hits: 1            # 反 B-补充3 · 同构比喻句法重复（>=3 FAIL）
    hyper_precision_detail_hits: 0           # 反 B-补充4 · 无工具高精度感知命中（>=3 FAIL）
    noninstrumental_numeric_density_per_1k: 3 # 反 B-补充4 · 无仪器数字密度/千字（>10 FAIL）
    signature_tick_overuse_hits: 0           # 反 E-扩展3 · 标志动作过度重复（>=1 FAIL）
    chapter_edge_tick_reuse: false           # 反 E-扩展3 · 章首/章尾同 tick 复用（近3章重复则 FAIL）
    system_option_matrix_hits: 0             # 反 G-补充3 · A/B/C/D 等完整选项矩阵命中（>=2 FAIL）
    bracket_system_block_count: 2            # 反 G-补充3 · 【系统块】数量（>=7 FAIL）
    multi_genre_graft_count: 2               # 反 P-补充4 · 同章强曝光题材轨道数（首章>=3 FAIL）
    graft_overload_hits: 0                   # 反 P-补充4 · 无代价硬缝合命中（>=1 FAIL；首章回滚级）
    foreshadow_pack_density_per_1k: 2        # 反 P-补充5 · 千字高权重伏笔数（>5 FAIL）
    high_priority_foreshadow_count: 2        # 反 P-补充5 · 高优先伏笔数（>=4 FAIL）
    golden_closing_line_hits: 0              # 反 N-补充 · 金句式收束命中（章尾命中权重更高）
    maxim_style_summary_hits: 0              # 反 N-补充 · 格言体总结句命中（>=2 FAIL）
    contrastive_negation_hits: 0             # 反 R-补充 ·「不是…是…/不是…、是…/不是…也不是…是…」等对照句全章命中（需 = 0；>=1 回滚级 FAIL）
    keyzone_contrastive_negation_hits: 0     # 反 R-补充 · 上类命中落在章首/章尾/高潮区的子集（需 = 0；>=1 回滚级 FAIL）
    suggestive_erotic_risk_hits: 0           # 反 E-扩展4 · 隐晦情色风险命中（按 explicitness_target_ratio 分档）
    explicit_sexual_content_hits: 0          # 反 E-扩展4 · 露骨性描写命中（>0 回滚级）
    high_risk_relationship_hits: 0           # 反 E-扩展4 · 高风险关系命中（>0 回滚级）
    romance_target_ratio: 20                 # 用户目标占比（%）：感情线
    erotic_tension_target_ratio: 8           # 用户目标占比（%）：色情张力
    explicitness_target_ratio: 0             # 用户目标占比（%）：露骨强度（可 >20，不封顶；但执行必须过审）
    chapter1_tension_hook_present: false     # 首章前800字是否落了关系高压触点
    romance_functional_scene_ratio: 1.0      # 感情段功能位覆盖率（推进关系/制造代价/反转认知/加深人设）
    desire_gradient_coverage: 3              # 欲望梯度覆盖级数（目光/距离/触碰/气味呼吸/后果）
    desire_gradient_jump_hits: 0             # 欲望梯度跨级跳跃命中（同章 1->5 直跳等）
    ambiguity_scene_template_compliance: 0.8 # 暧昧场景四步模板达标率（触发->失控->收束->余波）
    emotional_unpredictability_hits: 2       # 感情不可控噪声命中（误读/嘴硬/回避/延迟回复/说反话后补救）
    affection_flow_reversal_count: 1         # 关系回摆次数（靠近后后撤/承诺后迟疑）
    emotion_response_variance_score: 0.4     # 同类刺激反应方差（0~1）
    relationship_tacit_band: mid             # 关系默契档位：low / mid / high（由 state/relationships.md 判定）
    bilateral_dialogue_technique_hits: 1     # 全章“双方高完成度互相接住”次数（需 >=1，且受 tacit 档位上限约束）
    romance_arc_step: 1                      # 反 E-扩展6 · 爱情阶段（-3~+5：仇恨/厌恶/戒备/陌生/注意/试探/共担/承诺边缘/稳定亲密）
    friendship_arc_step: 2                   # 反 E-扩展6 · 友情阶段（-3~+5：死敌/敌对/不信任/陌生/同阵营/互信试用/共担风险/主动维护/生死托付）
    romance_step_delta_from_prev: 1          # 反 E-扩展6 · 爱情相对上一章阶段变化（默认 ≤ +1）
    friendship_step_delta_from_prev: 0       # 反 E-扩展6 · 友情相对上一章阶段变化（默认 ≤ +1）
    relationship_progression_beats: 2        # 反 E-扩展6 · 关系递进动作命中（承担代价/共享秘密/公开站队/主动维护边界）
    relationship_jump_without_cause_hits: 0  # 反 E-扩展6 · 无充分事件支撑的关系跳级命中（需 = 0）
    relationship_jump_with_cause_hits: 0     # 反 E-扩展6 · 有触发事件支撑的跨级跃迁命中（+2 及以上时需 ≥ 1）
    post_jump_emotional_turbulence_hits: 1   # 反 E-扩展6 · 跃迁后情绪余波命中（失控/躲闪/嘴硬/反复确认）
    combat_target_ratio: 15                  # 反 E-扩展7 · 打戏/对抗目标占比（%）
    combat_presence_hits: 1                  # 反 E-扩展7 · 有效打戏/对抗命中（有目标+阻力+代价）
    protagonist_distinctive_traits_count: 3  # 反 E-扩展7 · 主角非通用人格特征数
    protagonist_initiative_conflict_hits: 1  # 反 E-扩展7 · 主角主动制造/接管冲突命中
    protagonist_impulse_or_humor_hits: 1     # 反 E-扩展7 · 主角非纯谨慎反应命中（冲动/反讽/玩笑/嘴硬）
    protagonist_template_similarity_hits: 0  # 反 E-扩展7 · 与“沉默谨慎模板”相似命中（需 = 0）
    contrast_hook_enabled: false             # 反 P-补充6 · 是否启用反差钩子（默认 false）
    contrast_hook_frequency_10ch: 1          # 反 P-补充6 · 近10章反差钩子启用次数（需 ≤ 2）
    contrast_hook_chapter_gap: 4             # 反 P-补充6 · 距上次启用章节间隔（需 ≥ 3）
    contrast_hook_misuse_hits: 0             # 反 P-补充6 · 反差钩子滥用命中（需 = 0）
    weirdness_seed_type: xuanhuan_rule_glitch # 反 P-1 · 怪异预算种子类型（题材化：如 xuanhuan_side_effect / urban_light_mismatch）
    dialogue_subtext_misalignment_hits: 1     # 反 I-补充 · 高张力场景台词-内心/动作错位命中（需 ≥ 1）
    fully_matched_qa_chain_max: 2             # 反 I-补充 · 一问一答完全匹配连续轮次峰值（需 ≤ 3）
    chapter_pacing_matrix:                    # 章际对比矩阵（近3章）
      relation_tension: mid                   # low / mid / high
      mc_info_delta: gain                     # gain / loss / flat
      chapter_mood: suspended                 #压抑 / 舒展 / 悬置
      ending_hook_type: info_hook             # action_hook / info_hook / emotion_hook / no_hook
  antagonist_reactions:                     # 反 E-扩展
    - name: 柳长风
      template_hits: 2                      # 标准套餐（脸色/冷汗/胸口/沉默/"不可能"）命中数
      signature_hits: 2                     # signature_reactions 命中数
  soul_bleed:                               # 反 O：每个本章出场 ≥ 2 次的有名角色 + 本章首次登场的关键角色
    - name: 叶无尘
      role_tier: 关键                         # 关键 / 重要 / 次要 / 路人
      appearances_in_chapter: 8
      is_first_appearance: false
      bleed_count: 2                         # 非功能性渗透次数
      bleed_fields: [core_wound]             # 本章渗透涉及的灵魂字段
      bleed_evidence: ["写剑决前停手揉了揉虎口——师妹当年被剑气伤过同一处"]
      deletion_verified: true                # 删除该渗透句后剧情推进不受影响（反 O 非功能性判定）
    - name: 柳长风
      role_tier: 关键
      appearances_in_chapter: 4
      is_first_appearance: false
      bleed_count: 1
      bleed_fields: [third_dimension]
      bleed_evidence: ["动手前揉了揉右手腕，这是从未向别人提起过的旧伤"]
      deletion_verified: true
  character_interchangeability_check:       # 反 O · 路人 / 次要角色互换度抽查
    swapped_line_breaks_plot: false         # 将本章任意两个同类角色台词对调后剧情是否破坏
    unique_trait_per_named_character: true  # 每个有名角色在本章是否有 ≥ 1 处不可互换细节
  animal_independence:                       # 反 O · species != 人
    - name: 小焰
      appearances_in_chapter: 3
      independent_actions: 2                 # 与主角指令无关的反应次数
      evidence: ["主角焦虑时它盯着一只飞虫看很久"]
```

## 八步落盘（必须按顺序，不允许跳步）

### STEP 0 · 路径契约校验（反项目目录散落 · 硬门）

在写任何文件之前，对 `files_to_write` 列表执行：

1. 每条路径必须以 `<project_root>/` 开始（绝对或相对一致展开后）；否则立即 **PERSIST 拒收**。
2. 路径中**第一层**项必须落在 `{book.yaml, fingerprint.md, bible/, characters/, arcs/, chapters/, state/, index/, .webnovel-memory/}` 之一；否则立即 **PERSIST 拒收**。
3. 章节**正文**文件必须（且该章仅允许这一份正文）落在 `chapters/`，**命名 SFNC**：`ch<4位零填充>_<短标题>.md`（如 `chapters/ch0001_一剑破阵.md`）。`短标题` 与首行 H1 标题一致（为文件名可替换非法路径字符为 `_`，见下）。必须匹配正则 `^ch\d{4}_[^/\\:\*\?"<>\|]+\.md$`；否则拒收。同一 `NNNN` 在 `chapters/` 下**只能有一个**以 `chNNNN_` 开头的终稿文件。
4. 禁止章节终稿使用碎片化命名（如 `part1` / `part2` / `expanded_beats` / `draft` / `tmp` 等）；命中即拒收；不得只写 `ch0001.md` 而无 `_短标题`。
5. 章**元数据**（原写在章节 frontmatter 的 arc/pov/统计等）**仅**可写在 `state/chapter_meta/ch<NNNN>.yaml`；不得写回正文章节文件。该路径必须匹配 `^state/chapter_meta/ch\d{4}\.yaml$`。
6. 章节 **`.md` 正文文件**内**仅允许**一行一级标题（`# …`）与小说正文；禁止 YAML frontmatter、`---` 分隔线、HTML/XML 注释、`` ``` `` 代码围栏、除该 H1 外的任何 Markdown 结构；正文段内规则仍按根 `SKILL.md` 与 OpenClaw「纯叙事」约束执行。
7. 人物卡必须落在 `characters/<name>.md`；arc 文件必须落在 `arcs/arc-<NN>-<slug>.md`；否则拒收。
8. 禁止新建契约以外的目录（如 `drafts/` `output/` `tmp/` `generated/`）——一经发现，整轮 PERSIST 失败并回滚。

**`短标题` 与非法字符**（与首行 H1 对齐）：`chapter_file_slug` 可随 `chapter_body` 一并传入 PERSIST；若缺省，则取 `chapter_title` / H1 文本，**去除** Windows 保留字符 `\ / : * ? " < > |` 后作为文件名用短标题，空格可保留；若结果为空用 `untitled`。

拒收返回值必须包含：具体违规路径 + 正确目标路径建议。

### STEP 1 · 写章节正文 + 章元数据

1. 计算终稿相对路径 `chapters/ch<NNNN>_<短标题>.md`（`短标题` 见 STEP 0；与正文首行 H1 一致）。
2. 写章节正文文件，**有且仅有**下述结构（行序固定）：

```markdown
# <与 chapter_title 一致>

<chapter_body 即纯小说正文，已剔除任何 Markdown 装饰/元数据>
```

3. 将**完整** `chapter_meta`（与上方输入示例结构一致，含 `stats` 等）序列化为 `state/chapter_meta/ch<NNNN>.yaml`；**不得**在 `.md` 中重复。若与 `read-protocol` 衔接，上一章的 `hooks_planted` 等自本文件读取，而非自 `.md`。

### STEP 2 · 追加章节摘要

1. 追加一条到 `index/volume_<VOLUME_NO>_index.md`：

```markdown
## 第 87 章 · 一剑破阵
- arc：arc-03-夺剑
- 出场：叶无尘 / 柳长风
- 爽点：REV + ID + PWR（下一章禁用 PWR）
- 本章钩子：柳长风联合外宗围攻
- 摘要：<200-400 字>
```

### STEP 3 · 更新倒排索引

1. `index/volume_<VOLUME_NO>_index.md`：在本卷章节目录中追加当前章节条目（含章节号、标题、摘要、状态）
2. `index/volume_<VOLUME_NO>_index.md`：更新角色/地点/物品在本卷的命中锚点（不再写 `by-*` 分散文件）
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
   - **段长熵面板**：写入 `para_length_std` / `long_paras_over_80` / `long_paras_over_120` / `single_sentence_para_ratio` / `single_sentence_run_max` / `single_sentence_run_clusters`；std < 8 或长段 < 3 或 > 120 段 < 1 → 标记 "下一章强制补 ≥ 3 段长段（含 ≥ 1 段 > 120 字）"；单句段占比 > 0.3 或连续 > 2 或丛数 > 2 → 标记 "下一章强制打散单句段"
   - **非理性噪声面板**：`thought_blocks_with_irrational_noise / thought_blocks` < 100% → 标记 "下一章所有 ≥ 300 字思考段必须含非理性噪声"
   - **质量方差面板**：写入 `concreteness_variance` / `bright_lines` / `rough_lines`；方差 < 0.8 或亮句/粗糙句缺失 → 标记 "下一章成稿后强制挑 1 段亮化 + 1 段回退粗化"
   - **反派套餐面板**：写入 `antagonist_reactions[*].template_hits / signature_hits`；`template_hits > 2` 或 `signature_hits < 2` → 标记 "下一章该反派场景强制替换 ≥ 2 项为 signature"
   - **灵魂渗透面板（反 O）**：写入 `soul_bleed[*]`；对所有 `appearances_in_chapter ≥ 3` 的角色，若 `bleed_count == 0` → 加入"纯功能性角色名单"并标记 "下一章强制为该角色安排 ≥ 1 处非功能性灵魂渗透"；连续 2 章纯功能 → 升级为硬门（下一章不达标则不允许落盘）
   - **动物独立反应面板（反 O · species != 人）**：写入 `animal_independence[*]`；若 `independent_actions / appearances_in_chapter < 0.5` → 标记 "下一章该动物 / 灵兽必须有 ≥ 1 处与主角指令无关的独立行动"
   - **世界自主生活面板（反 D）**：写入 `filler_count` / `filler_unresolved_count` / `side_char_autonomous_agenda_count` / `choice_mechanism_waste_count`；以及 **D-4** `narration_buffer_marks` / `clip_style_chain_max` / `d4_pov`；
     - `filler_count < 5` 或 `filler_unresolved_count < 2` → 标记 "下一章强制补 ≥ 3 处剧情无关闲笔"
     - `side_char_autonomous_agenda_count == 0` → 标记 "下一章强制为 ≥ 1 位配角安排 ≥ 80 字自主议题"（即"与主角剧情无关的事"）
     - 若本章含选择/系统机制（`choice_mechanism_trigger_count ≥ 1`）且 `choice_mechanism_waste_count == 0` → 标记 "下一章此类机制必须 ≥ 1 次选废选项"
     - **D-4**：`clip_style_chain_max >= 3` → 标记 "本章已触回滚阈值须整体加缀笔/并句"；`narration_buffer_marks` 未达与 `d4_pov` 联动地板 → 标记 "下一章限知叙述每 ≈1000 字至少 1 处迟疑或从句套层"
   - **想象力面板（反 P）**：写入 `weirdness_budget_count` / `deferred_setup_count` / `anti_trope_actual_rank`；
     - `weirdness_budget_count == 0` → 标记 "下一章必须 ≥ 1 处怪异预算" + **回滚级硬门**（本章已违反）
     - `anti_trope_actual_rank ≤ 3` → 标记"下一章必须跳出本次 5-清单前 3 名"
   - **转场面板（反 Q）**：写入 `transition_types` 分布；
     - 单一类型在本章使用 ≥ 3 次 → 标记"下一章禁用该类型"
     - `forbidden_transition_words_hits ≥ 1` → 标记"下一章禁用转场词清单强制零容忍"
     - 最近 3 章 `Q-4 摩擦点桥` 使用 < 1 → 标记"下一章必须有 ≥ 1 次摩擦点桥"
   - **说明书句法面板（反 R）**：写入 `exclusion_enum_hits` / `tutorial_microstep_chain_max` / `catalog_afterthought_pairs`；
     - `exclusion_enum_hits ≥ 1` → 标记"下一章禁止双否定目录句"
     - `tutorial_microstep_chain_max ≥ 4` → 标记"下一章日常动作强制合并句 + 插入心理"
     - `catalog_afterthought_pairs ≥ 1` → 标记"下一章禁止验收式双短句"
   - **场景块面板（反 K-补充）**：写入 `k_scene_block_violations`；`≥ 3` → 标记"下一章时空跳变强制空行分段"
   - **元叙事面板（反 O-在场）**：写入 `meta_language_hits`；`≥ 1` → 标记"下一章全文禁上一章/读者/作者等词 + 本章回滚"
   - **抓眼节奏面板（反 A-补充）**：写入 `opening_hook_spike` / `curiosity_gap_markers` / `flat_atmosphere_streak_max`；`opening_hook_spike == false` 或 `curiosity_gap` 低于阈值 或 `flat_atmosphere_streak_max ≥ 6` → 标记"本章已触回滚阈值须整体重写"；`flat_atmosphere_streak_max == 5` → 标记"下一章减少纯氛围连段并补好奇缝隙"
   - **首章开胃面板（反 A-补充 · chapter 1 特判）**：若本章为 `chapter == 1`，强制写入 `series_opening_strike_count` / `opening_question_debt_present`；`strike_count < 2` 或 `opening_question_debt_present == false` → 标记"首章抓手不足，回滚级重写开头"
   - **系统提示模板面板（反 G-补充）**：写入 `system_prompt_template_hits`；`≥ 3` → 标记"下一章系统提示改残片化，不得复用同构模板"
   - **巧合闭环面板（反 P-补充）**：写入 `coincidence_chain_hits` / `forced_detour_hits`；`coincidence ≥ 4` 或 `detour ≥ 1` → 标记"下一章强制增加主动决策+代价节点"
   - **技术说明面板（反 G-补充2）**：写入 `tech_jargon_density_per_1k` / `tech_exposition_block_over_120` / `tech_mechanism_closure_hits`；超阈值则标记"下一章技术段先写体感与误判，禁止白皮书化直讲"
   - **词簇复读面板（反 B-补充）**：写入 `lexeme_cluster_repeat_hits` / `abstract_aura_token_density_per_1k`；超阈值则标记"下一章先替换抽象词为具象细节"
   - **近重复段面板（反 B-补充2）**：写入 `near_duplicate_paragraph_pairs` / `max_paragraph_similarity` / `duplicate_dialogue_openers`；`pairs >= 1` 或 `duplicate_dialogue_openers >= 1` → 标记"下一章先做段落去重再开写"；`pairs >= 2` 或 `similarity >= 0.92` → 本章回滚级
   - **比喻密度面板（反 B-补充3）**：写入 `simile_density_per_1k` / `simile_cluster_max` / `simile_pattern_repeat_hits`；超阈值则标记"下一章降低同构比喻并改为动作证据"
   - **数值化感知面板（反 B-补充4）**：写入 `hyper_precision_detail_hits` / `noninstrumental_numeric_density_per_1k`；超阈值则标记"下一章把伪精确数字改成体感表达"
   - **文化 shorthand 面板（反 P-补充2）**：写入 `cultural_shorthand_clash_hits` / `withhold_beat_present`；`cultural == 0` → 标记"本章已触回滚阈值" + **回滚级硬门**；`withhold == false` → 标记"下一章必须补一处抬高预期后的拒展示/留白收束"；连续 2 章 `cultural == 0` → 标记"下一章文化符号贴脸对抗为回滚级硬门"
   - **模板链条面板（反 P-补充3）**：写入 `trope_chain_hits` / `trope_chain_max_run` / `predictability_score`；`trope_hits >= 4` 或 `predictability == high` → 标记"下一章强制插入非收益扰动节点并拆开模板链"
   - **系统面板面板（反 G-补充3）**：写入 `system_option_matrix_hits` / `bracket_system_block_count`；超阈值则标记"下一章系统信息必须碎片化"
   - **跨题材缝合面板（反 P-补充4）**：写入 `multi_genre_graft_count` / `graft_overload_hits`；首章若超阈值标记"回滚级重写开局节拍"
   - **伏笔装载面板（反 P-补充5）**：写入 `foreshadow_pack_density_per_1k` / `high_priority_foreshadow_count`；超阈值标记"下一章降伏笔装载密度"
   - **反差钩子面板（反 P-补充6）**：写入 `contrast_hook_enabled` / `contrast_hook_frequency_10ch` / `contrast_hook_chapter_gap` / `contrast_hook_misuse_hits`；超阈值标记"下一章禁用反差钩子并回归常规推进"
   - **对话次文本面板（反 I-补充）**：写入 `dialogue_subtext_misalignment_hits` / `fully_matched_qa_chain_max`；若高张力场景中 `misalignment == 0` 或 `matched_chain > 3`，标记"下一章强制增加问答错位与非功能停顿"
   - **章际对比矩阵（反节奏均匀化）**：写入 `chapter_pacing_matrix.relation_tension` / `mc_info_delta` / `chapter_mood` / `ending_hook_type`；若任一维度连续 3 章相同，标记"第4章该维度强制变向"
   - **金句收束面板（反 N-补充）**：写入 `golden_closing_line_hits` / `maxim_style_summary_hits`；章尾命中则标记"下章改用动作后果收束"
   - **对照句面板（反 R-补充）**：写入 `contrastive_negation_hits` / `keyzone_contrastive_negation_hits`；**全章零容忍**：任一 >0 则本章拒收并重写；仅当连续多章为 0 时可标记"维持禁用不是…是…系骨架"
   - **过审风控面板（反 E-扩展4）**：写入 `suggestive_erotic_risk_hits` / `explicit_sexual_content_hits` / `high_risk_relationship_hits` / `explicitness_target_ratio`；命中则标记"下章改为可过审强张力写法（保留关系推进，不写露骨步骤）"
  - **感情功能面板**：写入 `romance_target_ratio` / `erotic_tension_target_ratio` / `explicitness_target_ratio` / `chapter1_tension_hook_present` / `romance_functional_scene_ratio` / `desire_gradient_coverage` / `desire_gradient_jump_hits` / `ambiguity_scene_template_compliance` / `emotional_unpredictability_hits` / `affection_flow_reversal_count` / `emotion_response_variance_score` / `relationship_tacit_band` / `bilateral_dialogue_technique_hits` / `romance_arc_step` / `friendship_arc_step` / `romance_step_delta_from_prev` / `friendship_step_delta_from_prev` / `relationship_progression_beats` / `relationship_jump_without_cause_hits` / `relationship_jump_with_cause_hits` / `post_jump_emotional_turbulence_hits`；不足阈值则标记"下章先补递进动作；若要跨级跃迁，必须补触发事件+代价后果+情绪余波三件套"
  - **主角与刺激面板（反 E-扩展7）**：写入 `combat_target_ratio` / `combat_presence_hits` / `protagonist_distinctive_traits_count` / `protagonist_initiative_conflict_hits` / `protagonist_impulse_or_humor_hits` / `protagonist_template_similarity_hits`；不足阈值则标记"下章强制补主角主动冲突与非纯谨慎反应，并补至少一处有效打戏或关系高压触点"
   - **标志动作面板（反 E-扩展3）**：写入 `signature_tick_overuse_hits` / `chapter_edge_tick_reuse`；`tick_overuse >= 1` → 标记"下一章更换角色标志动作表达"
6. `state/anti-trope-log.md`：按章追加一条：
   ```markdown
   ## 第 87 章
   - 5-清单（最常见接续）：
     1. 破阵后主角瞬间得剑
     2. 柳长风爆棚怒喝
     3. 弟子震惊下跪
   - 真实写的接续：柳长风没反应，只把剑丢进了祖坛水井
   - 接续排名：清单外（✓）
   - 怪异预算：演武场角落被画歪的柯基头像（剧情无法吸收）
   - 延迟兑付：叶无尘手腕内侧一道未解释的旧疤（预计 30 章后）
   ```
7. `state/open-threads.md`：把本章出现的新矛盾/疑团加入列表；把本章收束的从列表中移除

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
   - **强制校验**（反 O · 按角色分层）：
     - `role_tier == 关键`（主角 / POV / 女男主 / 核心反派 / 固定配角 top 5）：`soul_fields ≥ 2` 条，**且本章必须落灵魂渗透（回滚级硬门）**
     - `role_tier == 重要`（总出场 ≥ 2 次的有名角色）：`soul_fields ≥ 1` 条
     - `role_tier == 次要`（本章出场但暂定 1 次）：`soul_fields ≥ 1` 条（可标 `draft`）+ 本章 ≥ 1 处不可互换特征
     - `role_tier == 路人`：可无 soul_fields，但不得与其他路人可互换
     - 若 `species != 人` → 强制填 ≥ 1 条独立反应坐标轴
     - 若 `role == 反派` → 强制填第三维度
   - **任一分层空缺 → 本章整体写入失败回滚**，提示上游 agent 补足人物卡再重来。

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
6. **中文落盘约束**：写入到 `<project_root>/` 的 `*.md` 文档默认必须为中文叙述；允许英文仅限路径/字段键/代号（如 `chapter_meta.stats`、`REV`）与必要代码片段。若正文或状态说明出现大段英文叙述，判写入失败并回滚。
7. **反 AI 味硬门（全部通过才允许落盘，任一失败即回滚）**：

   **A. 结构级硬门**（反 M / B-扩展 / H-扩展 / N / E-扩展）
   - `excitement_interruption` 每条 `interruption` 字段 ∈ {`delay`, `denied`, `cost`}（反 M）
   - `stats.top_subject_ratio` ≤ 0.4（反 B-扩展）
   - `stats.para_length_std` ≥ 8（反 B-扩展）
   - `stats.thought_blocks_with_irrational_noise / max(1, stats.thought_blocks)` == 1.0（反 H-扩展）
   - `stats.concreteness_variance` ≥ 0.8 且 `bright_lines ≥ 1` 且 `rough_lines ≥ 1`（反 N）
   - 每个 `antagonist_reactions` 条目：`template_hits ≤ 2` 且 `signature_hits ≥ 2`（反 E-扩展）

   **B. 段长分布硬门**（反 C / K · 回滚级）
   - `stats.long_paras_over_80 ≥ 3`，且 `stats.long_paras_over_120 ≥ 1`（反 K · 全章 0 长段 → 回滚级 FAIL）
   - `stats.k_scene_block_violations ≤ 2`，**≥ 5 → 回滚级 FAIL**（反 K-补充 · 场景块黏段 / 该空行未空行）
   - `stats.single_sentence_para_ratio ≤ 0.3`，**> 0.5 → 回滚级 FAIL**（反 C / K · 2026-04 收紧）
   - `stats.single_sentence_run_max ≤ 2`，**≥ 6 → 回滚级 FAIL**（反 C · 2026-04 收紧）
   - `stats.single_sentence_run_clusters ≤ 2`（反 C · 2026-04 收紧）

   **C. 定义体 / 粗体 / 情感标签硬门**（反 G+1 / N-细 / E · 回滚级）
   - `stats.definition_style_hits ≤ 2`，**≥ 5 → 回滚级 FAIL**（反 G+1 · 整章退回 plot-design 重写）
   - `stats.bold_total ≤ 1` 且 `stats.bold_for_theme_emotion == 0`，**任一违反 → 回滚级 FAIL**（反 N-细 / E）
   - `stats.emotion_token_solo_paragraphs ≤ 1` 且 `stats.emotion_token_bold == 0`，**emotion_token_bold ≥ 1 → 回滚级 FAIL**（反 E）
   - `stats.setting_reveal_overload_hits == 0`（反 G-细）
   - `stats.signature_ming_pai_hits ≤ 1`（反 E+2）
   - `stats.system_prompt_template_hits ≤ 2`，**≥ 5 → 回滚级 FAIL**（反 G-补充）
   - `stats.tech_jargon_density_per_1k ≤ 8`，**> 12 → 回滚级 FAIL**（反 G-补充2）
   - `stats.tech_exposition_block_over_120 ≤ 1`，**≥ 3 → 回滚级 FAIL**（反 G-补充2）
   - `stats.tech_mechanism_closure_hits ≤ 1`，**≥ 2 → FAIL**（反 G-补充2）
   - `stats.lexeme_cluster_repeat_hits ≤ 3`，**≥ 7 → 回滚级 FAIL**（反 B-补充）
   - `stats.abstract_aura_token_density_per_1k ≤ 10`，**> 18 → 回滚级 FAIL**（反 B-补充）
   - `stats.near_duplicate_paragraph_pairs == 0`，**>= 2 → 回滚级 FAIL**（反 B-补充2）
   - `stats.max_paragraph_similarity < 0.88`，**>= 0.92 → 回滚级 FAIL**（反 B-补充2）
   - `stats.duplicate_dialogue_openers == 0`（反 B-补充2）
   - `stats.simile_density_per_1k ≤ 10`，**> 14 → FAIL**（反 B-补充3）
   - `stats.simile_cluster_max ≤ 3`，**>= 4 → FAIL**（反 B-补充3）
   - `stats.simile_pattern_repeat_hits ≤ 2`，**>= 3 → FAIL**（反 B-补充3）
   - `stats.hyper_precision_detail_hits ≤ 1`，**>= 3 → FAIL**（反 B-补充4）
   - `stats.noninstrumental_numeric_density_per_1k ≤ 6`，**> 10 → FAIL**（反 B-补充4）
   - `stats.signature_tick_overuse_hits == 0`（反 E-扩展3）
   - 若 `stats.explicitness_target_ratio == 0`，则 `stats.suggestive_erotic_risk_hits < 2`
   - 若 `0 < stats.explicitness_target_ratio <= 10`，则 `stats.suggestive_erotic_risk_hits <= 2`
   - 若 `stats.explicitness_target_ratio > 10`，则 `stats.suggestive_erotic_risk_hits <= 3`
   - `stats.explicit_sexual_content_hits == 0`，**> 0 → 回滚级 FAIL**（反 E-扩展4）
   - `stats.high_risk_relationship_hits == 0`，**> 0 → 回滚级 FAIL**（反 E-扩展4）
   - `stats.romance_target_ratio` / `stats.erotic_tension_target_ratio` / `stats.explicitness_target_ratio` 必须存在（开写前已询问），缺任一字段 → **FAIL（拒绝 PERSIST）**
   - `stats.suggestive_erotic_risk_hits` / `stats.explicit_sexual_content_hits` / `stats.high_risk_relationship_hits` / `stats.chapter1_tension_hook_present` 必须存在，缺任一字段 → **FAIL（拒绝 PERSIST）**
   - 若 `chapter_number == 1` 且 `stats.romance_target_ratio + stats.erotic_tension_target_ratio > 0`，则 `stats.chapter1_tension_hook_present == true`
   - `stats.romance_functional_scene_ratio ≥ 0.8`（感情功能位覆盖）
   - `stats.desire_gradient_jump_hits == 0` 且 `stats.desire_gradient_coverage ≥ 3`（欲望梯度递进）
   - `stats.ambiguity_scene_template_compliance ≥ 0.7`（暧昧场景模板完整度）
   - `stats.emotional_unpredictability_hits ≥ 2` 且 `stats.emotion_response_variance_score ≥ 0.3`（感情不可控噪声）
   - `stats.affection_flow_reversal_count ≥ 1`（关系回摆）
   - `stats.bilateral_dialogue_technique_hits >= 1`（全章至少一次双向接住）
   - 上限随 `stats.relationship_tacit_band`：`low ≤ 1`、`mid ≤ 2`、`high ≤ 3`（超上限视为沟通假）
  - `stats.romance_arc_step` / `stats.friendship_arc_step` 必须存在（反 E-扩展6）
  - `stats.relationship_progression_beats ≥ 1`（当章存在爱情或核心友情场景时）
  - `stats.relationship_jump_without_cause_hits == 0`（关系无因跳级）
  - 默认 `stats.romance_step_delta_from_prev ≤ 1` 且 `stats.friendship_step_delta_from_prev ≤ 1`；若任一 ≥ 2，则 `stats.relationship_jump_with_cause_hits ≥ 1` 且 `stats.post_jump_emotional_turbulence_hits ≥ 1`
  - `stats.protagonist_distinctive_traits_count ≥ 3`，`stats.protagonist_initiative_conflict_hits ≥ 1`，`stats.protagonist_impulse_or_humor_hits ≥ 1`，`stats.protagonist_template_similarity_hits == 0`（反 E-扩展7）
  - `stats.combat_target_ratio` 必须存在；若 `stats.combat_target_ratio > 0` 则 `stats.combat_presence_hits ≥ 1`（反 E-扩展7）
   - `stats.system_option_matrix_hits ≤ 1`，**>= 2 → FAIL**（反 G-补充3）
   - `stats.bracket_system_block_count ≤ 4`，**>= 7 → FAIL**（反 G-补充3）
   - `stats.dialogue_subtext_misalignment_hits ≥ 1`（高张力场景必过；反 I-补充）
   - `stats.fully_matched_qa_chain_max ≤ 3`，**> 3 → FAIL**（反 I-补充）
   - `stats.weirdness_seed_type` 必须存在（反 P-1 题材化种子）
   - `stats.chapter_pacing_matrix` 四字段必须存在：`relation_tension` / `mc_info_delta` / `chapter_mood` / `ending_hook_type`

   **节奏变向硬门（章际）**：
   - 读取近 3 章 `chapter_pacing_matrix`，若任一维度连续 3 章同值，则本章对应维度不得继续同值；违反 → **FAIL（拒绝 PERSIST）**

   **D. 角色灵魂硬门**（反 O · 回滚级）
   - 每个 `soul_bleed` 条目（`appearances_in_chapter ≥ 2`）：`bleed_count ≥ 1` 且 `deletion_verified == true`
   - **关键角色首次登场章**（`role_tier == '关键'` 且 `is_first_appearance == true`）：`bleed_count ≥ 1` 且 `deletion_verified == true` → **任一违反即回滚级 FAIL**（退回 story-blueprint 补 soul_fields，再回 plot-design 重写）
   - 上一章已被标为"纯功能性"的角色本章仍 `bleed_count == 0` → 强制硬失败
   - 每个 `animal_independence` 条目：`independent_actions / appearances_in_chapter ≥ 0.5`（反 O · species != 人）
   - `character_interchangeability_check.swapped_line_breaks_plot` 必须为 `false`
   - `character_interchangeability_check.unique_trait_per_named_character` 必须为 `true`
   - **`stats.meta_language_hits == 0`**（反 **O-在场** · 禁「上一章 / 下一章 / 读者 / 作者 / 弹幕」等元叙事语），**≥ 1 → 回滚级 FAIL**（退回 plot-design 全文检索清零）

   **E. 世界自主生活硬门**（反 D · 回滚级）
   - `stats.filler_count ≥ 5`，**< 3 → 回滚级 FAIL**（反 D-1 · 退回 plot-design 补闲笔）
   - `stats.filler_unresolved_count ≥ 2`（反 D-1 · 剧情无关闲笔必须 ≥ 2 处）
   - `stats.side_char_autonomous_agenda_count ≥ 1`，**= 0 → 回滚级 FAIL**（反 D-2 · 退回 plot-design 补配角议题）
   - 若 `stats.choice_mechanism_trigger_count ≥ 3`：`stats.choice_mechanism_waste_count ≥ 1`（反 D-3）；**全最优（waste=0）→ 回滚级 FAIL**
   - **D-4**（反剪辑体 / 句法级人类缀笔）：`stats.clip_style_chain_max ≤ 2`，**≥ 3 → 回滚级 FAIL**（退回 `webnovel-excitement-and-craft` 或 `webnovel-plot-design` 整段加缀笔）。设 `W = stats.chapter_word_count`。`narration_buffer_marks` 与 `d4_buffer_floor`（`d4_pov` 联动，见下）：当 `W` **不足 1200 字**（短章）时，**仅**强制本项之 `clip_style_chain_max`；`narration_buffer_marks` 不单独触发回滚。若 `W ≥ 1200`：当 `d4_pov == 'omniscient'` 时 `d4_buffer_floor = max(1, W // 3000)`，否则 `d4_buffer_floor = max(2, W // 1500)`；`narration_buffer_marks < d4_buffer_floor` 且 `W ≥ 2000` **→ 回滚级 FAIL**（与 L / N 叠加时从严）；`W` 在 1200–2000 间且未达地板 → 普通 **FAIL 或**同轮加缀笔，不自动抬回滚级。
     - `stats.d4_pov` 缺省按叙事实际补填；**禁止**为降地板滥用 `omniscient`。
   - 若 `stats.d4_pov` 字段缺失 / 未在 `first`/`limited`/`omniscient` 中取值 → 对 D-4 计数字段按 **FAIL（拒绝 PERSIST，要求补全 stats）** 处理

   **F. 想象力硬门**（反 P · 回滚级）
   - `stats.anti_trope_top5_declared == true`（动笔前必须已落盘 5-清单）
   - `stats.anti_trope_actual_rank` 必须 ≥ 4 或为清单外，**≤ 3 → 回滚级 FAIL**（反 P-4 · 退回 plot-design 重做预声明）
   - `stats.weirdness_budget_count ≥ 1`，**= 0 → 回滚级 FAIL**（反 P-1 · 退回 story-blueprint 补世界观）
   - `stats.deferred_setup_count ≥ 1`（反 P-3）
   - `stats.cultural_shorthand_clash_hits ≥ 1`，**= 0 → 回滚级 FAIL**（反 P-补充2 · 退回 plot-design 补「共有符号 × 对抗动作」并置）
   - `stats.withhold_beat_present == true`，**== false → FAIL**（反 P-补充2 · 补一处「抬高预期→拒展示/收束」后才可 PERSIST）
   - `stats.trope_chain_hits < 4`，**>= 4 → FAIL**（反 P-补充3）
   - `stats.trope_chain_max_run < 3` 或 `stats.weirdness_budget_count ≥ 1`，**连链>=3 且怪异预算=0 → 回滚级 FAIL**（反 P-补充3）
   - `stats.predictability_score != high`（反 P-补充3）
   - `stats.multi_genre_graft_count ≤ 2`，**>= 3 → FAIL**（反 P-补充4）
   - `stats.graft_overload_hits == 0`，**>= 1 → FAIL**（反 P-补充4；chapter 1 命中按回滚级）
   - `stats.foreshadow_pack_density_per_1k ≤ 3`，**> 5 → FAIL**（反 P-补充5）
   - `stats.high_priority_foreshadow_count ≤ 2`，**>= 4 → FAIL**（反 P-补充5）
   - `stats.contrast_hook_misuse_hits == 0`（反 P-补充6）
   - 若 `stats.contrast_hook_enabled == true`：`stats.contrast_hook_frequency_10ch ≤ 2` 且 `stats.contrast_hook_chapter_gap ≥ 3`（反 P-补充6）
   - `stats.coincidence_chain_hits ≤ 3`，**≥ 6 → 回滚级 FAIL**（反 P-补充 · 巧合闭环过快）
   - `stats.forced_detour_hits ≤ 1`，**≥ 2 → 回滚级 FAIL**（反 P-补充 · 强导向）

   **G. 转场硬门**（反 Q · 回滚级）
   - `stats.transition_count == len(stats.transition_types)` 且 `stats.transition_bridge_declared == true`（每次切换都必须声明桥）
   - `stats.forbidden_transition_words_hits == 0`，**≥ 2 → 回滚级 FAIL**（反 Q · 退回 plot-design 重写转场）
   - `stats.teleport_transitions == 0`，**≥ 1 → 回滚级 FAIL**（反 Q · 任一瞬移切换均回滚）
   - 近 3 章内单一桥类型使用次数 ≤ 章数 × 1.5（避免"永远只用摩擦点桥"这种新套路化）

   **H. 说明书句法硬门**（反 R · 回滚级）
   - `stats.exclusion_enum_hits == 0`，**≥ 2 → 回滚级 FAIL**；**== 1 且 `stats.definition_style_hits ≥ 1` → 回滚级 FAIL**（R-1 与 G+1 同段叠加）
   - `stats.tutorial_microstep_chain_max ≤ 4`，**≥ 5 → 回滚级 FAIL**（反 R-2）
   - `stats.catalog_afterthought_pairs == 0`，**≥ 1 → 回滚级 FAIL**（反 R-3 · 验收式双短句）
   - `stats.contrastive_negation_hits == 0`，**>= 1 → 回滚级 FAIL**（反 R-补充 ·「不是…是…」系全章零容忍）
   - `stats.keyzone_contrastive_negation_hits == 0`，**>= 1 → 回滚级 FAIL**（反 R-补充 · 关键段命中加重；与全章硬门同时生效）

   **H-2. 收束腔调硬门**（反 N-补充）
   - `stats.golden_closing_line_hits ≤ 1`
   - `stats.maxim_style_summary_hits ≤ 1`，**>= 2 → FAIL**（格言体过密）

   **I. 章首钩子与好奇缝隙硬门**（反 **A-补充** · 回滚级）
   - `stats.opening_hook_spike == true`，**== false → 回滚级 FAIL**（退回 plot-design 重写章首 ≈200 字）
   - `stats.curiosity_gap_markers ≥ max(2, stats.chapter_word_count // 1200)`（整数除；短文仍至少 2 处），**不足 → 回滚级 FAIL**
   - `stats.flat_atmosphere_streak_max ≤ 5`，**≥ 6 → 回滚级 FAIL**（连续纯氛围段过长）
   - 若本章 `chapter == 1`：`stats.series_opening_strike_count ≥ 2` 且 `stats.opening_question_debt_present == true`，任一不满足 → **回滚级 FAIL**（退回 plot-design 重写首章开头）

任一"普通硬门"失败 → 回滚写入，要求 `webnovel-plot-design` 重写当章。
任一"回滚级 FAIL" → 回滚写入 + 强制回退到指定 workflow（见对应硬门注释）+ 标记该章必须整体重做，不允许仅局部修补。

**回滚路径映射速查**：

| 回滚级 FAIL 来源 | 退回 workflow |
|---|---|
| C（单句段） / K（长段） | plot-design |
| D-1 / D-2 / D-3 / **D-4**（人类缀笔 / 剪辑体） | plot-design；**D-4 偏文笔层时** 可先 `webnovel-excitement-and-craft` 加缀笔再 PERSIST |
| E（情感独段 / 粗体） / N-细 / G-细 | plot-design |
| **E-扩展4**（露骨性描写 / 高风险关系） | plot-design（降级为关系后果表达） |
| G+1（定义体） / M（爽点链条） / N（质量方差） | plot-design |
| P-3 / P-4 / Q | plot-design |
| **R（说明书句法）** / **R-补充（「不是…是…」系全章零容忍）** / **K-补充（场景块）** | plot-design |
| **O-在场（元叙事）** / **A-补充（章首钩子·好奇缝隙）** | plot-design |
| P-1（怪异预算） | story-blueprint（补世界观） → plot-design |
| **P-补充2**（`cultural_shorthand_clash_hits == 0`） | plot-design（补文化 shorthand 贴脸对抗） |
| **B-补充2**（近重复段 `pairs >= 2` 或 `similarity >= 0.92`） | plot-design（先段落去重） |
| **P-补充3**（模板链 `max_run >=3` 且怪异预算=0） | plot-design（重排节拍并插入扰动） |
| O（关键角色首登） | story-blueprint（补 soul_fields） → plot-design |

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
3. 从 `index/volume_<VOLUME_NO>_index.md` 删除该章摘要条目
4. 在 `index/volume_<VOLUME_NO>_index.md` 中同步移除该章相关的角色/地点/物品命中锚点
5. 从 `foreshadow.md` 撤销本章相关状态变更
6. 删除该章终稿 `chapters/ch<NNNN>_<短标题>.md` 与对应该章号的 `state/chapter_meta/ch<NNNN>.yaml`（若存在其他同名 `ch<NNNN>_*.md` 碎片一并清理）

这就要求 STEP 1–7 开始前**备份所有将改动的文件副本到 `.webnovel-memory/backup/<chapter>/`**。
