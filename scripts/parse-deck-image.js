#!/usr/bin/env node
/**
 * ワンピースカード デッキレシピ画像解析スクリプト
 *
 * 使い方:
 *   node scripts/parse-deck-image.js <画像URL or ファイルパス>
 *   node scripts/parse-deck-image.js https://pbs.twimg.com/media/XXX.jpg
 *   node scripts/parse-deck-image.js ~/Downloads/deck.png
 *
 * 出力: JSON形式のデッキリスト
 */

const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY が設定されていません');
  console.error('   export ANTHROPIC_API_KEY="sk-ant-..."');
  process.exit(1);
}

const input = process.argv[2];
if (!input) {
  console.error('❌ 画像URLまたはファイルパスを指定してください');
  console.error('   node scripts/parse-deck-image.js <URL or PATH>');
  process.exit(1);
}

const DECK_DB_PATH = path.join(__dirname, '..', 'src', 'data', 'deck-recipes.json');

const SYSTEM_PROMPT = `あなたはワンピースカードゲームのデッキレシピ画像を解析するエキスパートです。
画像からカード情報を正確に読み取り、JSON形式で出力してください。

出力フォーマット:
{
  "leader": {
    "cardId": "OP15-058",
    "name": "エネル",
    "count": 1
  },
  "mainDeck": [
    {
      "cardId": "OP15-060",
      "name": "エネル",
      "cost": 6,
      "power": 8000,
      "count": 4,
      "category": "character"
    }
  ],
  "totalCards": 50,
  "deckType": "紫エネル"
}

ルール:
- カード番号は「OP15-060」「ST29-009」「EB04-058」「P-120」などの形式
- 枚数は各カード画像の右上に表示される数字（1〜4）
- costは左上の丸い数字
- powerはカード上部に表示（キャラクターのみ）
- categoryは character / event / stage のいずれか
- カード名はカード下部に表示
- 必ず有効なJSONのみを出力すること（説明文は不要）`;

async function parseImage(imageInput) {
  let imageContent;

  if (imageInput.startsWith('http')) {
    // URL形式
    imageContent = {
      type: 'image',
      source: {
        type: 'url',
        url: imageInput
      }
    };
  } else {
    // ファイルパス形式
    const filePath = imageInput.startsWith('~')
      ? imageInput.replace('~', process.env.HOME)
      : imageInput;
    const imageData = fs.readFileSync(filePath);
    const base64 = imageData.toString('base64');
    const ext = path.extname(filePath).toLowerCase();
    const mediaType = ext === '.png' ? 'image/png' : 'image/jpeg';

    imageContent = {
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType,
        data: base64
      }
    };
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          imageContent,
          {
            type: 'text',
            text: 'この画像のデッキレシピを解析して、JSON形式で出力してください。カード番号、カード名、枚数を正確に読み取ってください。'
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error ${response.status}: ${err}`);
  }

  const result = await response.json();
  const text = result.content[0].text;

  // JSONを抽出（```json ... ``` で囲まれている場合に対応）
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) {
    throw new Error('JSONが見つかりません: ' + text.substring(0, 200));
  }

  return JSON.parse(jsonMatch[1]);
}

function saveDeckRecipe(recipe, source) {
  let recipes = [];
  if (fs.existsSync(DECK_DB_PATH)) {
    recipes = JSON.parse(fs.readFileSync(DECK_DB_PATH, 'utf-8'));
  }

  const entry = {
    id: `recipe-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    source: source,
    ...recipe
  };

  recipes.push(entry);
  fs.writeFileSync(DECK_DB_PATH, JSON.stringify(recipes, null, 2) + '\n');

  return entry;
}

(async () => {
  console.log('🃏 デッキレシピ画像解析');
  console.log(`📷 入力: ${input}`);
  console.log('🔍 解析中...\n');

  try {
    const recipe = await parseImage(input);

    console.log(`✅ 解析成功！`);
    console.log(`📋 デッキタイプ: ${recipe.deckType}`);
    console.log(`👤 リーダー: ${recipe.leader.name} (${recipe.leader.cardId})`);
    console.log(`🃏 メインデッキ: ${recipe.mainDeck.length}種類 / ${recipe.totalCards}枚\n`);

    console.log('--- カードリスト ---');
    console.log(`リーダー: ${recipe.leader.name} (${recipe.leader.cardId})`);
    recipe.mainDeck.forEach(card => {
      const powerStr = card.power ? ` ${card.power}` : '';
      console.log(`  ${card.count}x ${card.name} (${card.cardId}) [コスト${card.cost}${powerStr}] ${card.category}`);
    });

    // JSONファイルに保存
    const saved = saveDeckRecipe(recipe, input);
    console.log(`\n💾 保存完了: ${DECK_DB_PATH}`);
    console.log(`   ID: ${saved.id}`);

  } catch (error) {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  }
})();
