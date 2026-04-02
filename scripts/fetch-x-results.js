#!/usr/bin/env node
/**
 * X API でワンピースカードの大会結果を取得するスクリプト
 *
 * 使い方:
 *   node scripts/fetch-x-results.js
 *   node scripts/fetch-x-results.js --days 7   # 過去7日分
 *   node scripts/fetch-x-results.js --dry-run   # JSON出力のみ（ファイル更新しない）
 */

const fs = require('fs');
const path = require('path');

// .env.local からトークン読み込み
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/X_BEARER_TOKEN="(.+?)"/);
if (!tokenMatch) {
  console.error('❌ X_BEARER_TOKEN not found in .env.local');
  process.exit(1);
}
const BEARER_TOKEN = tokenMatch[1];

const RESULTS_PATH = path.join(__dirname, '..', 'src', 'data', 'results.json');

// コマンドライン引数
const args = process.argv.slice(2);
const daysBack = args.includes('--days') ? parseInt(args[args.indexOf('--days') + 1]) : 3;
const dryRun = args.includes('--dry-run');

// 検索クエリ: 店舗の優勝報告ポストを狙う
const SEARCH_QUERIES = [
  '"ワンピースカードゲーム" "優勝" "デッキ" -is:retweet',
  '"ワンピカード" "優勝" "デッキ" -is:retweet',
  '"ONEPIECEカードゲーム" "優勝" -is:retweet',
  '"ワンピースカード" "店舗予選" "優勝" -is:retweet',
  '"ワンピースカード" "フラッグシップ" "優勝" -is:retweet',
];

// デッキ名の正規化マップ
const DECK_ALIASES = {
  'むらさきエネル': '紫エネル',
  '紫 エネル': '紫エネル',
  'エネル': '紫エネル',
  '紫エネル⚡': '紫エネル',
  'エネル⚡️': '紫エネル',
  'エネル⚡': '紫エネル',
  'えねる': '紫エネル',
  'ポルチェエネル': '紫エネル',
  'クリーク': '赤緑クリーク',
  'ルーシー': '赤青ルーシー',
  '#ロジャー': '赤紫ロジャー',
  '赤パープルロジャー': '赤紫ロジャー',
  '黄ルフィ(空島)': '空島ルフィ',
  '黄色ルフィ': '空島ルフィ',
  '赤緑 クリーク': '赤緑クリーク',
  '赤青 ルーシー': '赤青ルーシー',
  '青赤ルーシー': '赤青ルーシー',
  '空島 ルフィ': '空島ルフィ',
  '黒黄 モリア': '黒黄モリア',
  '黒 イム': '黒イム',
  '黒 ティーチ': '黒ティーチ',
  '赤紫 シュガー': '赤紫シュガー',
  '緑紫 ルフィ': '緑紫ルフィ',
  '赤黒 サボ': '赤黒サボ',
  '赤黄 ボニー': '赤黄ボニー',
  '緑 ミホーク': '緑ミホーク',
  '虹ルフィ': '虹ルフィ',
  '赤紫 ロジャー': '赤紫ロジャー',
  '青黄 エース': '青黄エース',
  '黄 カルガラ': '黄カルガラ',
};

// 既知のデッキ名リスト（テキストから検出用）
const KNOWN_DECKS = [
  '紫エネル', '赤青ルーシー', '空島ルフィ', '赤緑クリーク',
  '黒黄モリア', '黒イム', '黒ティーチ', '赤紫シュガー',
  '緑紫ルフィ', '赤黒サボ', '赤黄ボニー', '緑ミホーク',
  '虹ルフィ', '赤紫ロジャー', '青黄エース', '黄カルガラ',
  '赤紫ルフィ', '黒スモーカー', '青紫レイジュ', '黄エネル',
  '赤ゾロ', '赤シャンクス', '緑ウタ', '青ドフラミンゴ',
  '黒モリア', '赤紫ルフィ', '青ナミ', '緑ボニー',
];

/**
 * X API v2 の Recent Search エンドポイントを呼ぶ
 */
async function searchTweets(query, startTime) {
  const params = new URLSearchParams({
    query: query,
    max_results: '100',
    'tweet.fields': 'created_at,text,author_id',
    start_time: startTime,
  });

  const url = `https://api.x.com/2/tweets/search/recent?${params}`;

  console.log(`🔍 Searching: ${query.substring(0, 50)}...`);

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${BEARER_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error ${response.status}: ${errorText}`);
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * ツイートテキストからデッキ名を抽出
 */
function extractDeckName(text) {
  // パターン1: 【デッキ】XXX or デッキ：XXX or デッキ名：XXX or 使用デッキ:XXX
  const deckPatterns = [
    /【デッキ[名]?】\s*(.+?)[\n\r【]/,
    /デッキ[名]?\s*[:：]\s*(.+?)[\n\r]/,
    /使用デッキ\s*[:：]\s*(.+?)[\n\r]/,
    /デッキリーダー\s*[:：は]?\s*(.+?)[\n\r]/,
  ];

  for (const pattern of deckPatterns) {
    const match = text.match(pattern);
    if (match) {
      let deck = match[1].trim()
        .replace(/^[「『]/, '').replace(/[」』]$/, '')
        .replace(/[⚡️⚡🔥💀]/g, '')
        .trim();
      // エイリアスで正規化
      if (DECK_ALIASES[deck]) return DECK_ALIASES[deck];
      // 既知デッキに含まれるか
      if (KNOWN_DECKS.includes(deck)) return deck;
      // 既知デッキ名が部分一致するか
      for (const known of KNOWN_DECKS) {
        if (deck.includes(known)) return known;
      }
      // 2文字以下やゴミっぽいデータは除外
      if (deck.length <= 2) return null;
      return deck;
    }
  }

  // パターン2: 既知のデッキ名がテキスト内にあるか
  for (const deck of KNOWN_DECKS) {
    if (text.includes(deck)) return deck;
  }

  return null;
}

/**
 * ツイートテキストからプレイヤー名を抽出
 */
function extractPlayerName(text) {
  const patterns = [
    /【優勝】\s*(.+?)\s*様/,
    /【優勝】\s*(.+?)[\n\r【]/,
    /優勝\s*[:：は]\s*(.+?)\s*[様さん]?[\n\r]/,
    /優勝\s+(.+?)\s*[様さん!！]/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let name = match[1].trim()
        .replace(/[🏆🥇👑‼️⚡️]/g, '')
        .replace(/^[、，\s]+/, '')
        .replace(/[、，\s]+$/, '')
        .replace(/^「/, '').replace(/」$/, '')
        .replace(/^『/, '').replace(/』$/, '')
        .trim();
      if (name.length > 0 && name.length < 20) return name;
    }
  }
  return null;
}

/**
 * ツイートテキストから大会種別を判定
 */
function extractEventType(text) {
  if (text.includes('フラッグシップ') || text.includes('フラシ')) return 'flagship';
  if (text.includes('店舗予選') || text.includes('チャンピオンシップ')) return 'championship';
  return 'store';
}

/**
 * ツイートテキストから店舗名を抽出
 */
function extractStoreName(text, authorHandle) {
  // ハッシュタグから店舗名を推定
  const hashtagMatch = text.match(/#([^\s#]+(?:店|カード|TSUTAYA|トレカ)[^\s#]*)/);
  if (hashtagMatch) return hashtagMatch[1];
  return null;
}

/**
 * メイン処理
 */
async function main() {
  console.log(`\n🃏 ワンピースカード 大会結果収集スクリプト`);
  console.log(`📅 過去${daysBack}日分を検索します\n`);

  const startTime = new Date();
  startTime.setDate(startTime.getDate() - daysBack);
  const startTimeStr = startTime.toISOString();

  // 全クエリで検索
  const allTweets = new Map(); // 重複排除用

  for (const query of SEARCH_QUERIES) {
    try {
      const tweets = await searchTweets(query, startTimeStr);
      for (const tweet of tweets) {
        if (!allTweets.has(tweet.id)) {
          allTweets.set(tweet.id, tweet);
        }
      }
      // レートリミット対策: 1秒待つ
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`❌ Error searching: ${err.message}`);
    }
  }

  console.log(`\n📊 取得ツイート数: ${allTweets.size}件`);

  // パース
  const parsedResults = [];
  let skipped = 0;

  for (const [id, tweet] of allTweets) {
    const deckName = extractDeckName(tweet.text);
    if (!deckName) {
      skipped++;
      continue;
    }

    const date = tweet.created_at.split('T')[0];
    const result = {
      id: `${date.replace(/-/g, '')}-x${id.slice(-4)}`,
      date,
      eventType: extractEventType(tweet.text),
      storeName: extractStoreName(tweet.text) || null,
      region: null,
      placement: 1,
      deckName,
      playerName: extractPlayerName(tweet.text) || null,
      source: `https://x.com/i/status/${id}`,
    };

    parsedResults.push(result);
  }

  console.log(`✅ パース成功: ${parsedResults.length}件`);
  console.log(`⏭️ スキップ（デッキ名不明）: ${skipped}件\n`);

  // デッキ分布を表示
  const deckCount = {};
  parsedResults.forEach(r => {
    deckCount[r.deckName] = (deckCount[r.deckName] || 0) + 1;
  });
  console.log('📈 デッキ分布:');
  Object.entries(deckCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([deck, count]) => {
      const bar = '█'.repeat(Math.min(count, 30));
      console.log(`  ${deck.padEnd(12)} ${bar} ${count}件`);
    });

  if (dryRun) {
    console.log('\n🔍 [dry-run] ファイルは更新しません');
    console.log(JSON.stringify(parsedResults.slice(0, 5), null, 2));
    return;
  }

  // 既存データとマージ
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
  } catch (e) {
    console.log('⚠️ 既存データなし。新規作成します。');
  }

  // 既存IDセット
  const existingIds = new Set(existing.map(r => r.id));
  const existingDates = new Set(existing.map(r => r.date));

  // 新規のみ追加（同日・同デッキ名の重複も排除）
  const existingDeckDates = new Set(existing.map(r => `${r.date}-${r.deckName}-${r.playerName || ''}`));
  let newCount = 0;

  for (const result of parsedResults) {
    const key = `${result.date}-${result.deckName}-${result.playerName || ''}`;
    if (!existingIds.has(result.id) && !existingDeckDates.has(key)) {
      existing.push(result);
      existingDeckDates.add(key);
      newCount++;
    }
  }

  // 日付でソート（新しい順）
  existing.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(existing, null, 2) + '\n');
  console.log(`\n💾 results.json 更新完了！`);
  console.log(`   既存: ${existing.length - newCount}件 + 新規: ${newCount}件 = 合計: ${existing.length}件`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
