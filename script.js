let score = 0;
let totalScore = 0;
let level1Score = 0;
let level2Score = 0;
let currentLevel = 1;
let currentSubLevel = 1;
let wrongWords = [];
let level1WrongWords = [];
let isFixingErrors = false;
let highestScore = parseInt(localStorage.getItem('highestScore')) || 0;
let practiceIndex = 0;
let practiceWords = [];
let singleHanziWriter = null;
let isFlipped = false;
let isAudioPlaying = false;

const modeSelection = document.querySelector('#mode-selection.persistent');
const currentScoreDisplay = document.getElementById('current-score');
const totalScoreDisplay = document.getElementById('total-score');
const levelDisplay = document.getElementById('level');
const levelComplete = document.getElementById('level-complete');
const levelScoreDisplay = document.getElementById('level-score');
const levelTotal = document.getElementById('level-total');
const levelTotalScoreDisplay = document.getElementById('level-total-score');
const level1Errors = document.getElementById('level-1-errors');
const wrongWordsList = document.getElementById('wrong-words-list');
const hanziContainer = document.getElementById('hanzi-container');
const pinyinContainer = document.getElementById('pinyin-container');
const celebration = document.getElementById('celebration');
const finalScoreDisplay = document.getElementById('final-score');
const finalHighestScoreDisplay = document.getElementById('final-highest-score');
const highestScoreDisplay = document.getElementById('highest-score');
const practiceMode = document.getElementById('practice-mode');
const gameMode = document.getElementById('game-mode');
const flashcard = document.querySelector('.flashcard');
const flashcardHanzi = document.getElementById('flashcard-hanzi');
const flashcardPinyin = document.getElementById('flashcard-pinyin');
const flashcardMeaning = document.getElementById('flashcard-meaning');
const singleWordMode = document.getElementById('single-word-mode');
const singleWordList = document.getElementById('single-word-list');
const singleHanzi = document.getElementById('single-hanzi');
const singlePinyin = document.getElementById('single-pinyin');
const singleMeaning = document.getElementById('single-meaning');
const singleStrokes = document.getElementById('single-strokes');
const singleAnimationGif = document.getElementById('single-animation-gif');
const singleAnimationFallback = document.getElementById('single-animation-fallback');
const singleAnimation = document.getElementById('single-animation');
const articleMode = document.getElementById('article-mode');
const readingMode = document.getElementById('reading-mode');
const articleContent = document.getElementById('article-content');
const fullAudio = document.getElementById('full-audio');
const segmentAudio = document.getElementById('segment-audio');
const celebrateSound = document.getElementById('celebrate-sound');
const wordAudio = document.getElementById('word-audio');
let currentHighlightedSegment = null;

highestScoreDisplay.textContent = `历史最高分数: ${highestScore} (Highest Score: ${highestScore})`;

const articleSegments = [
    { text: '静夜思', audio: 'audio/segment_1.mp3', articleId: 'full_article' },
    { text: 'Thoughts on a Silent Night', audio: 'audio/segment_2.mp3', articleId: 'article_2', isEnglish: true },
    { text: '(唐)李白', audio: 'audio/segment_3.mp3', articleId: 'article_3' },
    { text: '床前明月光，', audio: 'audio/segment_4.mp3', articleId: 'article_4' },
    { text: '疑是地上霜。', audio: 'audio/segment_5.mp3', articleId: 'article_5' },
    { text: '举头望明月，', audio: 'audio/segment_6.mp3', articleId: 'article_6' },
    { text: '低头思故乡。', audio: 'audio/segment_7.mp3', articleId: 'article_7' },
    { text: '登鹳雀楼', audio: 'audio/segment_8.mp3', articleId: 'article_8' },
    { text: 'At Heron Lodge', audio: 'audio/segment_9.mp3', articleId: 'article_9', isEnglish: true },
    { text: '(唐)王之涣', audio: 'audio/segment_10.mp3', articleId: 'article_10' },
    { text: '白日依山尽，', audio: 'audio/segment_11.mp3', articleId: 'article_11' },
    { text: '黄河入海流。', audio: 'audio/segment_12.mp3', articleId: 'article_12' },
    { text: '欲穷千里目，', audio: 'audio/segment_13.mp3', articleId: 'article_13' },
    { text: '更上一层楼。', audio: 'audio/segment_14.mp3', articleId: 'article_14' }
];

const allWords = {
    'level-1-1': [
        { hanzi: '诗', pinyin: 'shī', meaningCn: '诗歌', meaningEn: 'poem', strokeCount: 8, animation: 'https://bishun.gjcha.com/8BD7.gif', audio: 'audio/words/诗.mp3' },
        { hanzi: '首', pinyin: 'shǒu', meaningCn: '首', meaningEn: 'head, first', strokeCount: 9, animation: 'https://bishun.gjcha.com/9996.gif', audio: 'audio/words/首.mp3' },
        { hanzi: '静', pinyin: 'jìng', meaningCn: '安静', meaningEn: 'quiet, still', strokeCount: 14, animation: 'https://bishun.gjcha.com/9759.gif', audio: 'audio/words/静.mp3' }
    ],
    'level-1-2': [
        { hanzi: '床', pinyin: 'chuáng', meaningCn: '床', meaningEn: 'bed', strokeCount: 7, animation: 'https://bishun.gjcha.com/5E8A.gif', audio: 'audio/words/床.mp3' },
        { hanzi: '疑', pinyin: 'yí', meaningCn: '疑惑', meaningEn: 'doubt, suspect', strokeCount: 14, animation: 'https://bishun.gjcha.com/7591.gif', audio: 'audio/words/疑.mp3' },
        { hanzi: '举', pinyin: 'jǔ', meaningCn: '举起', meaningEn: 'lift, raise', strokeCount: 9, animation: 'https://bishun.gjcha.com/4E3E.gif', audio: 'audio/words/举.mp3' }
    ],
    'level-1-3': [
        { hanzi: '望', pinyin: 'wàng', meaningCn: '眺望', meaningEn: 'look at, hope', strokeCount: 11, animation: 'https://bishun.gjcha.com/671B.gif', audio: 'audio/words/望.mp3' },
        { hanzi: '低', pinyin: 'dī', meaningCn: '低', meaningEn: 'low', strokeCount: 7, animation: 'https://bishun.gjcha.com/4F4E.gif', audio: 'audio/words/低.mp3' }
    ],
    'level-2-1': [
        { hanzi: '乡', pinyin: 'xiāng', meaningCn: '家乡', meaningEn: 'hometown, village', strokeCount: 3, animation: 'https://bishun.gjcha.com/4E61.gif', audio: 'audio/words/乡.mp3' },
        { hanzi: '楼', pinyin: 'lóu', meaningCn: '楼房', meaningEn: 'building, floor', strokeCount: 13, animation: 'https://bishun.gjcha.com/697C.gif', audio: 'audio/words/楼.mp3' },
        { hanzi: '千', pinyin: 'qiān', meaningCn: '千', meaningEn: 'thousand', strokeCount: 3, animation: 'https://bishun.gjcha.com/5343.gif', audio: 'audio/words/千.mp3' }
    ],
    'level-2-2': [
        { hanzi: '更', pinyin: 'gèng', meaningCn: '更', meaningEn: 'more, even more', strokeCount: 7, animation: 'https://bishun.gjcha.com/66F4.gif', audio: 'audio/words/更.mp3' },
        { hanzi: '层', pinyin: 'céng', meaningCn: '层', meaningEn: 'layer, floor', strokeCount: 7, animation: 'https://bishun.gjcha.com/5C42.gif', audio: 'audio/words/层.mp3' }
    ],
    'level-2-3': [
        { hanzi: '诗', pinyin: 'shī', meaningCn: '诗歌', meaningEn: 'poem', strokeCount: 8, animation: 'https://bishun.gjcha.com/8BD7.gif', audio: 'audio/words/诗.mp3' },
        { hanzi: '首', pinyin: 'shǒu', meaningCn: '首', meaningEn: 'head, first', strokeCount: 9, animation: 'https://bishun.gjcha.com/9996.gif', audio: 'audio/words/首.mp3' }
    ],
    'level-3-1': [
        { hanzi: '静', pinyin: 'jìng', meaningCn: '安静', meaningEn: 'quiet, still', strokeCount: 14, animation: 'https://bishun.gjcha.com/9759.gif', audio: 'audio/words/静.mp3' },
        { hanzi: '床', pinyin: 'chuáng', meaningCn: '床', meaningEn: 'bed', strokeCount: 7, animation: 'https://bishun.gjcha.com/5E8A.gif', audio: 'audio/words/床.mp3' },
        { hanzi: '疑', pinyin: 'yí', meaningCn: '疑惑', meaningEn: 'doubt, suspect', strokeCount: 14, animation: 'https://bishun.gjcha.com/7591.gif', audio: 'audio/words/疑.mp3' },
        { hanzi: '举', pinyin: 'jǔ', meaningCn: '举起', meaningEn: 'lift, raise', strokeCount: 9, animation: 'https://bishun.gjcha.com/4E3E.gif', audio: 'audio/words/举.mp3' }
    ],
    'level-3-2': [
        { hanzi: '望', pinyin: 'wàng', meaningCn: '眺望', meaningEn: 'look at, hope', strokeCount: 11, animation: 'https://bishun.gjcha.com/671B.gif', audio: 'audio/words/望.mp3' },
        { hanzi: '低', pinyin: 'dī', meaningCn: '低', meaningEn: 'low', strokeCount: 7, animation: 'https://bishun.gjcha.com/4F4E.gif', audio: 'audio/words/低.mp3' },
        { hanzi: '乡', pinyin: 'xiāng', meaningCn: '家乡', meaningEn: 'hometown, village', strokeCount: 3, animation: 'https://bishun.gjcha.com/4E61.gif', audio: 'audio/words/乡.mp3' },
        { hanzi: '楼', pinyin: 'lóu', meaningCn: '楼房', meaningEn: 'building, floor', strokeCount: 13, animation: 'https://bishun.gjcha.com/697C.gif', audio: 'audio/words/楼.mp3' }
    ],
    'level-3-3': [
        { hanzi: '千', pinyin: 'qiān', meaningCn: '千', meaningEn: 'thousand', strokeCount: 3, animation: 'https://bishun.gjcha.com/5343.gif', audio: 'audio/words/千.mp3' },
        { hanzi: '更', pinyin: 'gèng', meaningCn: '更', meaningEn: 'more, even more', strokeCount: 7, animation: 'https://bishun.gjcha.com/66F4.gif', audio: 'audio/words/更.mp3' },
        { hanzi: '层', pinyin: 'céng', meaningCn: '层', meaningEn: 'layer, floor', strokeCount: 7, animation: 'https://bishun.gjcha.com/5C42.gif', audio: 'audio/words/层.mp3' },
        { hanzi: '诗', pinyin: 'shī', meaningCn: '诗歌', meaningEn: 'poem', strokeCount: 8, animation: 'https://bishun.gjcha.com/8BD7.gif', audio: 'audio/words/诗.mp3' }
    ]
};

const allUniqueWords = [
    { hanzi: '诗', pinyin: 'shī', meaningCn: '诗歌', meaningEn: 'poem', strokeCount: 8, animation: 'https://bishun.gjcha.com/8BD7.gif', audio: 'audio/words/诗.mp3' },
    { hanzi: '首', pinyin: 'shǒu', meaningCn: '首', meaningEn: 'head, first', strokeCount: 9, animation: 'https://bishun.gjcha.com/9996.gif', audio: 'audio/words/首.mp3' },
    { hanzi: '静', pinyin: 'jìng', meaningCn: '安静', meaningEn: 'quiet, still', strokeCount: 14, animation: 'https://bishun.gjcha.com/9759.gif', audio: 'audio/words/静.mp3' },
    { hanzi: '床', pinyin: 'chuáng', meaningCn: '床', meaningEn: 'bed', strokeCount: 7, animation: 'https://bishun.gjcha.com/5E8A.gif', audio: 'audio/words/床.mp3' },
    { hanzi: '疑', pinyin: 'yí', meaningCn: '疑惑', meaningEn: 'doubt, suspect', strokeCount: 14, animation: 'https://bishun.gjcha.com/7591.gif', audio: 'audio/words/疑.mp3' },
    { hanzi: '举', pinyin: 'jǔ', meaningCn: '举起', meaningEn: 'lift, raise', strokeCount: 9, animation: 'https://bishun.gjcha.com/4E3E.gif', audio: 'audio/words/举.mp3' },
    { hanzi: '望', pinyin: 'wàng', meaningCn: '眺望', meaningEn: 'look at, hope', strokeCount: 11, animation: 'https://bishun.gjcha.com/671B.gif', audio: 'audio/words/望.mp3' },
    { hanzi: '低', pinyin: 'dī', meaningCn: '低', meaningEn: 'low', strokeCount: 7, animation: 'https://bishun.gjcha.com/4F4E.gif', audio: 'audio/words/低.mp3' },
    { hanzi: '乡', pinyin: 'xiāng', meaningCn: '家乡', meaningEn: 'hometown, village', strokeCount: 3, animation: 'https://bishun.gjcha.com/4E61.gif', audio: 'audio/words/乡.mp3' },
    { hanzi: '楼', pinyin: 'lóu', meaningCn: '楼房', meaningEn: 'building, floor', strokeCount: 13, animation: 'https://bishun.gjcha.com/697C.gif', audio: 'audio/words/楼.mp3' },
    { hanzi: '千', pinyin: 'qiān', meaningCn: '千', meaningEn: 'thousand', strokeCount: 3, animation: 'https://bishun.gjcha.com/5343.gif', audio: 'audio/words/千.mp3' },
    { hanzi: '更', pinyin: 'gèng', meaningCn: '更', meaningEn: 'more, even more', strokeCount: 7, animation: 'https://bishun.gjcha.com/66F4.gif', audio: 'audio/words/更.mp3' },
    { hanzi: '层', pinyin: 'céng', meaningCn: '层', meaningEn: 'layer, floor', strokeCount: 7, animation: 'https://bishun.gjcha.com/5C42.gif', audio: 'audio/words/层.mp3' }
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 课文模式

function startArticleMode() {
    console.log('开始课文模式...');
    practiceMode.style.display = 'none';
    gameMode.style.display = 'none';
    singleWordMode.style.display = 'none';
    articleMode.style.display = 'block';
    readingMode.style.display = 'block';
    articleContent.innerHTML = ''; // 清除残留内容
    showArticleContent();
}

function playFullArticle() {
    console.log('尝试播放全篇音频...');
    // 停止并重置所有音频
    fullAudio.pause();
    fullAudio.currentTime = 0;
    segmentAudio.pause();
    segmentAudio.currentTime = 0;

    fullAudio.src = 'audio/full_article.mp3';
    fullAudio.load();
    console.log('全篇音频源设置为:', fullAudio.src);

    fullAudio.play()
        .then(() => {
            console.log('全篇音频播放成功');
            isAudioPlaying = true;
            setTimeout(() => {
                if (isAudioPlaying) {
                    document.addEventListener('click', stopAudioOnClick);
                }
            }, 500);
        })
        .catch(error => {
            console.error('全篇音频播放失败:', error);
            alert('无法播放课文音频，请检查音频文件路径或浏览器权限设置。\n错误: ' + error.message);
        });
}

function playSegment(articleId) {
    console.log('尝试播放分段音频，articleId:', articleId);
    const segment = articleSegments.find(seg => seg.articleId === articleId);
    if (!segment) {
        console.error('未找到对应 articleId 的段落:', articleId);
        return;
    }

    // 停止并重置全篇音频
    fullAudio.pause();
    fullAudio.currentTime = 0;
    console.log('全篇音频已停止以播放分段音频');

    // 移除之前的点击停止监听
    document.removeEventListener('click', stopAudioOnClick);

    // 移除之前的高亮
    if (currentHighlightedSegment) {
        currentHighlightedSegment.classList.remove('highlight');
    }

    // 设置并高亮当前段落
    const newHighlightedSegment = articleContent.querySelector(`.segment[data-article-id="${articleId}"]`);
    if (newHighlightedSegment) {
        newHighlightedSegment.classList.add('highlight');
        currentHighlightedSegment = newHighlightedSegment;
    } else {
        console.error('未找到对应 DOM 元素:', articleId);
    }

    // 播放分段音频
    segmentAudio.src = segment.audio;
    segmentAudio.load();
    console.log('分段音频源设置为:', segmentAudio.src);
    segmentAudio.play()
        .then(() => {
            console.log('分段音频播放成功:', segment.audio);
            isAudioPlaying = true;
            // 音频播放结束时移除高亮
            segmentAudio.onended = () => {
                newHighlightedSegment.classList.remove('highlight');
                currentHighlightedSegment = null;
                isAudioPlaying = false;
            };
        })
        .catch(error => {
            console.error('分段音频播放失败:', error);
            if (error.message.includes('interrupted by a call to pause')) {
                console.warn('播放被中断，正在重试...');
                segmentAudio.play();
            } else {
                alert('无法播放分段音频，请检查音频文件或网络连接。\n错误: ' + error.message);
            }
        });
}

function stopAudioOnClick(event) {
    if (!event.target.closest('#play-article') && !event.target.closest('.segment')) {
        if (!fullAudio.paused) {
            fullAudio.pause();
            fullAudio.currentTime = 0;
            console.log('全篇音频被点击停止');
        }
        if (!segmentAudio.paused) {
            segmentAudio.pause();
            segmentAudio.currentTime = 0;
            console.log('分段音频被点击停止');
        }
        isAudioPlaying = false;
        document.removeEventListener('click', stopAudioOnClick);
    }
}

function showArticleContent() {
    const pinyinMap = {
        '静': 'jìng', '夜': 'yè', '思': 'sī', '床': 'chuáng', '前': 'qián', '明': 'míng', '月': 'yuè', '光': 'guāng',
        '疑': 'yí', '是': 'shì', '地': 'dì', '上': 'shàng', '霜': 'shuāng', '举': 'jǔ', '头': 'tóu', '望': 'wàng',
        '低': 'dī', '故': 'gù', '乡': 'xiāng', '登': 'dēng', '鹳': 'guàn', '雀': 'què', '楼': 'lóu', '白': 'bái',
        '日': 'rì', '依': 'yī', '山': 'shān', '尽': 'jìn', '黄': 'huáng', '河': 'hé', '入': 'rù', '海': 'hǎi',
        '流': 'liú', '欲': 'yù', '穷': 'qióng', '千': 'qiān', '里': 'lǐ', '目': 'mù', '更': 'gèng', '一': 'yī',
        '层': 'céng', '唐': 'táng', '李': 'lǐ', '王': 'wáng', '之': 'zhī', '涣': 'huàn', '(': '', ')': ''
    };

    const punctuation = [',', '。', '，', ' '];

    let result = '';
    articleSegments.forEach(segment => {
        const chars = segment.text.split('');
        let pinyinLine = '';

        if (segment.isEnglish) {
            pinyinLine = `<span class="english-text">${segment.text}</span>`;
        } else {
            for (let i = 0; i < chars.length; i++) {
                if (punctuation.includes(chars[i])) {
                    pinyinLine += `<span class="char-pair"><span class="pinyin"></span><span class="hanzi">${chars[i]}</span></span>`;
                } else {
                    const pinyin = pinyinMap[chars[i]] || chars[i];
                    pinyinLine += `<span class="char-pair"><span class="pinyin">${pinyin}</span><span class="hanzi">${chars[i]}</span></span>`;
                }
            }
        }

        result += `
            <div class="segment" data-article-id="${segment.articleId}">
                <div class="pinyin-line">${pinyinLine.trim()}</div>
            </div>
        `;
    });

    articleContent.innerHTML = result;
    console.log('生成的文章内容:', articleContent.innerHTML);

    const segments = articleContent.querySelectorAll('.segment');
    segments.forEach(segment => {
        const articleId = segment.getAttribute('data-article-id');
        console.log('绑定点击事件，段落 articleId:', articleId);
        segment.addEventListener('click', () => {
            console.log('点击段落，触发播放:', articleId);
            playSegment(articleId);
        });
    });
}

function exitArticleMode() {
    fullAudio.pause();
    fullAudio.currentTime = 0;
    segmentAudio.pause();
    segmentAudio.currentTime = 0;
    isAudioPlaying = false;
    document.removeEventListener('click', stopAudioOnClick);
    articleMode.style.display = 'none';
    readingMode.style.display = 'none';
    articleContent.innerHTML = '';
}

// 单字模式
function startSingleWordMode() {
    console.log('开始单字模式...');
    fullAudio.pause();
    fullAudio.currentTime = 0;
    segmentAudio.pause();
    segmentAudio.currentTime = 0;
    document.removeEventListener('click', stopAudioOnClick);
    wordAudio.pause();
    wordAudio.currentTime = 0;
    practiceMode.style.display = 'none';
    flashcardHanzi.textContent = ''; // 清除练习模式内容
    flashcardPinyin.textContent = '';
    flashcardMeaning.innerHTML = '';
    gameMode.style.display = 'none';
    hanziContainer.innerHTML = ''; // 清除游戏模式内容
    pinyinContainer.innerHTML = '';
    articleMode.style.display = 'none';
    singleWordMode.style.display = 'block';
    showSingleWordList();
}

function showSingleWordList() {
    console.log('渲染单字列表...');
    let clickCountMap = new Map();

    singleWordList.innerHTML = allUniqueWords.map(word => `
        <div class="word-item" data-hanzi="${word.hanzi}">
            <span class="pinyin">${word.pinyin}</span>
            <span class="hanzi">${word.hanzi}</span>
        </div>
    `).join('');
    singleHanzi.textContent = '';
    singlePinyin.textContent = '';
    singleMeaning.textContent = '';
    singleStrokes.textContent = '';
    singleAnimationGif.style.display = 'none';
    singleAnimationFallback.style.display = 'none';
    const wordItems = singleWordList.querySelectorAll('.word-item');

    const handleWordClick = (event) => {
        const hanzi = event.currentTarget.getAttribute('data-hanzi');
        const word = allUniqueWords.find(w => w.hanzi === hanzi);
        let clickCount = clickCountMap.get(hanzi) || 0;
        clickCount++;
        clickCountMap.set(hanzi, clickCount);

        if (word) {
            wordItems.forEach(i => i.classList.remove('highlight'));
            event.currentTarget.classList.add('highlight');
            singleHanzi.textContent = word.hanzi;
            singlePinyin.textContent = `拼音: ${word.pinyin} (Pinyin: ${word.pinyin})`;
            singleMeaning.innerHTML = `含义: ${word.meaningCn}<br>Meaning: ${word.meaningEn}`;
            singleStrokes.textContent = `笔画数: ${word.strokeCount} (Stroke Count: ${word.strokeCount})`;
            singleAnimationGif.src = word.animation;
            singleAnimationGif.style.display = 'block';
            singleAnimationFallback.style.display = 'none';
            wordAudio.src = word.audio;
            wordAudio.play().catch(error => console.error('单词音频播放失败:', error));
            if (singleHanziWriter) {
                singleHanziWriter.setCharacter(word.hanzi);
            } else {
                singleHanziWriter = HanziWriter.create('single-animation', word.hanzi, {
                    width: window.innerWidth > 600 ? 150 : Math.min(150, window.innerWidth * 0.35),
                    height: window.innerWidth > 600 ? 150 : Math.min(150, window.innerWidth * 0.35),
                    padding: 5,
                    showOutline: true,
                    strokeAnimationSpeed: 1,
                    strokeHighlightSpeed: 0.5,
                    highlightColor: '#FF0000'
                });
            }

            if (clickCount === 2) {
                event.currentTarget.removeEventListener('click', handleWordClick);
                console.log(`移除 ${hanzi} 的点击监听`);
            }
        }
    };

    wordItems.forEach(item => item.addEventListener('click', handleWordClick));
}

function animateSingleStrokeOrder() {
    if (singleHanziWriter) singleHanziWriter.animateCharacter();
}

function exitSingleWordMode() {
    wordAudio.pause();
    wordAudio.currentTime = 0;
    singleWordMode.style.display = 'none';
    singleWordList.innerHTML = ''; // 清除单字模式内容
}

// 练习模式
function startPracticeMode() {
    console.log('开始练习模式...');
    fullAudio.pause();
    fullAudio.currentTime = 0;
    segmentAudio.pause();
    segmentAudio.currentTime = 0;
    document.removeEventListener('click', stopAudioOnClick);
    wordAudio.pause();
    wordAudio.currentTime = 0;
    practiceIndex = 0;
    practiceWords = shuffle([...allUniqueWords]);
    singleWordMode.style.display = 'none';
    singleWordList.innerHTML = ''; // 清除单字模式内容
    gameMode.style.display = 'none';
    hanziContainer.innerHTML = ''; // 清除游戏模式内容
    pinyinContainer.innerHTML = '';
    articleMode.style.display = 'none';
    practiceMode.style.display = 'block';
    showPracticeWord();
}

function showPracticeWord() {
    console.log('渲染练习单词...');
    const word = practiceWords[practiceIndex];
    flashcardHanzi.textContent = word.hanzi;
    flashcardPinyin.textContent = `拼音: ${word.pinyin} (Pinyin: ${word.pinyin})`;
    flashcardMeaning.innerHTML = `含义: ${word.meaningCn}<br>Meaning: ${word.meaningEn}`;
    isFlipped = false;
    flashcard.classList.remove('flipped');
    wordAudio.src = word.audio;

    const playButton = document.querySelector('#practice-controls button:nth-child(1)');
    let clickCount = 0;
    const handlePlayClick = () => {
        clickCount++;
        if (wordAudio.src) {
            wordAudio.play().catch(error => console.error('单词音频播放失败:', error));
            if (clickCount === 2) {
                playButton.removeEventListener('click', handlePlayClick);
                console.log(`移除 ${word.hanzi} 音频的点击监听`);
            }
        } else {
            console.error('单词音频源未设置');
        }
    };
    playButton.removeEventListener('click', handlePlayClick);
    playButton.addEventListener('click', handlePlayClick);
}

function flipCard() {
    isFlipped = !isFlipped;
    flashcard.classList.toggle('flipped', isFlipped);
}

function nextPracticeWord() {
    practiceIndex++;
    if (practiceIndex < practiceWords.length) {
        showPracticeWord();
    } else {
        exitPracticeMode();
    }
}

function exitPracticeMode() {
    wordAudio.pause();
    wordAudio.currentTime = 0;
    practiceMode.style.display = 'none';
    flashcardHanzi.textContent = '';
    flashcardPinyin.textContent = '';
    flashcardMeaning.innerHTML = ''; // 清除练习模式内容
}

// 游戏模式
function startGameMode() {
    console.log('开始游戏模式...');
    fullAudio.pause();
    fullAudio.currentTime = 0;
    segmentAudio.pause();
    segmentAudio.currentTime = 0;
    document.removeEventListener('click', stopAudioOnClick);
    wordAudio.pause();
    wordAudio.currentTime = 0;
    singleWordMode.style.display = 'none';
    singleWordList.innerHTML = ''; // 清除单字模式内容
    practiceMode.style.display = 'none';
    flashcardHanzi.textContent = '';
    flashcardPinyin.textContent = '';
    flashcardMeaning.innerHTML = ''; // 清除练习模式内容
    articleMode.style.display = 'none';
    gameMode.style.display = 'block';
    setLevel(currentLevel, currentSubLevel);
}

function exitGameMode() {
    gameMode.style.display = 'none';
    hanziContainer.innerHTML = '';
    pinyinContainer.innerHTML = ''; // 清除游戏模式内容
}

function updateScoreDisplay() {
    currentScoreDisplay.textContent = `当前关卡分数: ${score} (Current Level Score: ${score})`;
    totalScoreDisplay.textContent = `累计分数: ${totalScore} (Total Score: ${totalScore})`;
}

function saveGame() {
    const gameState = { score, totalScore, level1Score, level2Score, currentLevel, currentSubLevel, wrongWords, level1WrongWords, isFixingErrors };
    localStorage.setItem('chineseGameState', JSON.stringify(gameState));
}

function loadGame() {
    const savedState = localStorage.getItem('chineseGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        score = gameState.score;
        totalScore = gameState.totalScore;
        level1Score = gameState.level1Score;
        level2Score = gameState.level2Score;
        currentLevel = gameState.currentLevel;
        currentSubLevel = gameState.currentSubLevel;
        wrongWords = gameState.wrongWords;
        level1WrongWords = gameState.wrongWords;
        isFixingErrors = gameState.isFixingErrors;
        if (isFixingErrors) fixLevel1Errors();
        else setLevel(currentLevel, currentSubLevel);
        updateScoreDisplay();
    } else {
        alert('没有找到保存的进度！(No Saved Progress Found!)');
    }
}

function startOver() {
    localStorage.removeItem('chineseGameState');
    score = 0;
    totalScore = 0;
    level1Score = 0;
    level2Score = 0;
    currentLevel = 1;
    currentSubLevel = 1;
    wrongWords = [];
    level1WrongWords = [];
    isFixingErrors = false;
    setLevel(1, 1);
}

function tryAgain() {
    localStorage.removeItem('chineseGameState');
    location.reload();
}

function done() {
    window.close();
}

function fixLevel1Errors() {
    isFixingErrors = true;
    levelDisplay.textContent = `关卡 1 错误整理 (Level 1 Error Correction)`;
    score = 0;
    updateScoreDisplay();
    levelComplete.style.display = 'none';
    level1Errors.style.display = 'block';
    celebration.style.display = 'none';
    levelTotal.style.display = 'none';
    wrongWordsList.textContent = level1WrongWords.map(word => word.hanzi).join(' ');
    hanziContainer.innerHTML = '';
    pinyinContainer.innerHTML = '';
    const shuffledHanzi = shuffle([...level1WrongWords]);
    const shuffledPinyin = shuffle([...level1WrongWords]);
    shuffledHanzi.forEach(word => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-hanzi', word.hanzi);
        card.textContent = word.hanzi;
        hanziContainer.appendChild(card);
    });
    shuffledPinyin.forEach(word => {
        const zone = document.createElement('div');
        zone.className = 'drop-zone';
        zone.setAttribute('data-pinyin', word.pinyin);
        zone.textContent = word.pinyin;
        pinyinContainer.appendChild(zone);
    });
    bindTapEvents();
}

function setLevel(level, subLevel) {
    console.log(`设置游戏模式关卡 ${level}-${subLevel}`);
    currentLevel = level;
    currentSubLevel = subLevel;
    levelDisplay.textContent = currentLevel === 3 ? 
        `关卡 3：第七课 - 古诗二首 ${currentSubLevel}/3 (Level 3: Chapter 7 - Two Ancient Poems ${currentSubLevel}/3)` : 
        `当前关卡: ${currentLevel}-${currentSubLevel} (Current Level: ${currentLevel}-${currentSubLevel})`;
    
    let words = allWords[`level-${level}-${subLevel}`];
    if (wrongWords.length > 0) words = [...words, ...wrongWords];
    wrongWords = [];

    isFixingErrors = false;
    score = 0;
    updateScoreDisplay();
    levelComplete.style.display = 'none';
    level1Errors.style.display = 'none';
    celebration.style.display = 'none';
    levelTotal.style.display = 'none';

    hanziContainer.innerHTML = '';
    pinyinContainer.innerHTML = '';

    let shuffledHanzi = [...words];
    let shuffledPinyin = [...words];
    for (let i = 0; i < 3; i++) {
        shuffledHanzi = shuffle(shuffledHanzi);
        shuffledPinyin = shuffle(shuffledPinyin);
    }

    const hanziPositions = Array.from({ length: shuffledHanzi.length }, (_, i) => i);
    shuffle(hanziPositions);
    hanziPositions.forEach(pos => {
        const word = shuffledHanzi[pos];
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-hanzi', word.hanzi);
        card.textContent = word.hanzi;
        hanziContainer.appendChild(card);
    });

    const pinyinPositions = Array.from({ length: shuffledPinyin.length }, (_, i) => i);
    shuffle(pinyinPositions);
    pinyinPositions.forEach(pos => {
        const word = shuffledPinyin[pos];
        const zone = document.createElement('div');
        zone.className = 'drop-zone';
        zone.setAttribute('data-pinyin', word.pinyin);
        zone.innerHTML = `<span class="pinyin-text">${word.pinyin}</span>`;
        pinyinContainer.appendChild(zone);
    });

    bindTapEvents();
    adjustPinyinFontSize(); // 动态调整拼音字体大小
}

function adjustPinyinFontSize() {
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        const pinyinText = zone.textContent;
        if (pinyinText.length > 5) {
            zone.style.fontSize = '12px';
        } else if (pinyinText.length > 3) {
            zone.style.fontSize = '14px';
        } else {
            zone.style.fontSize = '16px';
        }
    });
}

function bindTapEvents() {
    const cards = document.querySelectorAll('.card');
    const dropZones = document.querySelectorAll('.drop-zone');
    let selectedCard = null;
    let selectedZone = null;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (selectedCard) selectedCard.classList.remove('selected');
            if (selectedZone) selectedZone.classList.remove('selected');
            selectedCard = card;
            selectedZone = null;
            card.classList.add('selected');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('click', () => {
            if (!selectedCard) {
                if (selectedZone) selectedZone.classList.remove('selected');
                selectedZone = zone;
                zone.classList.add('selected');
                return;
            }

            const hanzi = selectedCard.getAttribute('data-hanzi');
            const pinyin = zone.getAttribute('data-pinyin');
            const correctMatch = {};
            Object.keys(allWords).forEach(level => {
                allWords[level].forEach(word => {
                    correctMatch[word.hanzi] = word.pinyin;
                });
            });

            if (correctMatch[hanzi] === pinyin) {
                score += 10;
                const remainingCards = Array.from(cards).filter(c => c.style.display !== 'none');

                if (remainingCards.length === 1) {
                    selectedCard.classList.remove('selected');
                    selectedCard.classList.add('correct');
                    zone.classList.remove('selected');
                    zone.classList.add('correct');
                    zone.textContent = `${hanzi} - ${pinyin}`;
                    selectedCard.style.display = 'none';
                    selectedCard = null;

                    setTimeout(() => {
                        saveGame();
                        handleLevelComplete();
                    }, 1000);
                } else {
                    selectedCard.classList.remove('selected');
                    selectedCard.classList.add('correct');
                    zone.classList.remove('selected');
                    zone.classList.add('correct');
                    zone.textContent = `${hanzi} - ${pinyin}`;
                    selectedCard.style.display = 'none';
                    selectedCard = null;

                    if (remainingCards.length - 1 === 0) {
                        handleLevelComplete();
                    }
                }
            } else {
                score -= 5;
                zone.classList.add('wrong');
                setTimeout(() => zone.classList.remove('wrong'), 500);

                const wrongWord = allUniqueWords.find(w => w.hanzi === hanzi);
                if (wrongWord && !wrongWords.some(w => w.hanzi === hanzi)) wrongWords.push(wrongWord);
                if (currentLevel === 1 && wrongWord && !level1WrongWords.some(w => w.hanzi === hanzi)) level1WrongWords.push(wrongWord);
                selectedCard.classList.remove('selected');
                selectedCard = null;
            }
            updateScoreDisplay();
        });
    });
}

function handleLevelComplete() {
    if (!isFixingErrors) {
        totalScore += score;
        if (currentLevel === 1) level1Score += score;
        else if (currentLevel === 2) level2Score += score;
    }

    if (isFixingErrors) {
        wrongWords = [];
        level1WrongWords = [];
        score = totalScore;
        updateScoreDisplay();
        levelTotal.style.display = 'block';
        levelTotalScoreDisplay.textContent = `关卡 1 总分: ${level1Score} (Level 1 Total Score: ${level1Score})`;
        setTimeout(() => setLevel(2, 1), 1000);
    } else if (currentLevel === 3 && currentSubLevel === 3) {
        levelTotal.style.display = 'block';
        levelTotalScoreDisplay.textContent = `关卡 3 总分: ${totalScore} (Level 3 Total Score: ${totalScore})`;
        setTimeout(() => {
            celebration.style.display = 'block';
            levelTotal.style.display = 'none';
            finalScoreDisplay.textContent = `最终分数: ${totalScore} (Final Score: ${totalScore})`;
            if (totalScore > highestScore) {
                highestScore = totalScore;
                localStorage.setItem('highestScore', highestScore);
                highestScoreDisplay.textContent = `历史最高分数: ${highestScore} (Highest Score: ${highestScore})`;
            }
            finalHighestScoreDisplay.textContent = `历史最高分数: ${highestScore} (Highest Score: ${highestScore})`;
            celebrateSound.play();
            setTimeout(() => { celebrateSound.pause(); celebrateSound.currentTime = 0; }, 3000);
        }, 1000);
    } else if (currentLevel === 1 && currentSubLevel === 3) {
        if (level1WrongWords.length > 0) {
            fixLevel1Errors();
        } else {
            wrongWords = [];
            level1WrongWords = [];
            score = totalScore;
            updateScoreDisplay();
            levelTotal.style.display = 'block';
            levelTotalScoreDisplay.textContent = `关卡 1 总分: ${level1Score} (Level 1 Total Score: ${level1Score})`;
            setTimeout(() => setLevel(2, 1), 1000);
        }
    } else if (currentLevel === 2 && currentSubLevel === 3) {
        wrongWords = [];
        score = totalScore;
        updateScoreDisplay();
        levelTotal.style.display = 'block';
        levelTotalScoreDisplay.textContent = `关卡 2 总分: ${totalScore} (Level 2 Total Score: ${totalScore})`;
        setTimeout(() => setLevel(3, 1), 1000);
    } else {
        let nextLevel = currentLevel;
        let nextSubLevel = currentSubLevel + 1;
        if (nextSubLevel > 3) {
            nextLevel++;
            nextSubLevel = 1;
            wrongWords = [];
            if (nextLevel === 2 || nextLevel === 3) {
                score = totalScore;
                updateScoreDisplay();
                levelTotal.style.display = 'block';
                levelTotalScoreDisplay.textContent = `关卡 ${nextLevel - 1} 总分: ${nextLevel === 2 ? level1Score : totalScore} (Level ${nextLevel - 1} Total Score: ${nextLevel === 2 ? level1Score : totalScore})`;
                setTimeout(() => setLevel(nextLevel, nextSubLevel), 1000);
                return;
            }
        }
        levelComplete.style.display = 'block';
        levelScoreDisplay.textContent = `本关得分: ${score} (Sub-Level Score: ${score})`;
        setTimeout(() => setLevel(nextLevel, nextSubLevel), 1000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    practiceMode.style.display = 'none';
    gameMode.style.display = 'none';
    singleWordMode.style.display = 'none';
    articleMode.style.display = 'none';
    readingMode.style.display = 'none';

    const buttons = modeSelection.querySelectorAll('button');
    buttons.forEach(button => {
        switch (button.textContent.trim()) {
            case '课文模式' || 'Article Mode':
                button.addEventListener('click', startArticleMode);
                console.log('绑定课文模式到按钮:', button.textContent);
                break;
            case '练习模式' || 'Practice Mode':
                button.addEventListener('click', startPracticeMode);
                console.log('绑定练习模式到按钮:', button.textContent);
                break;
            case '游戏模式' || 'Game Mode':
                button.addEventListener('click', startGameMode);
                console.log('绑定游戏模式到按钮:', button.textContent);
                break;
            case '单字模式' || 'Single Word Mode':
                button.addEventListener('click', startSingleWordMode);
                console.log('绑定单字模式到按钮:', button.textContent);
                break;
            default:
                console.warn('未识别的按钮文本:', button.textContent);
        }
    });

    showSingleWordList(); // 初始化单字模式列表（仅生成 DOM，不显示）
});
