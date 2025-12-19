
// 完整的题库池，包含5个场景
const FULL_QUESTION_POOL = [
  {
    id: "pool-1", 
    productName: "除螨喷雾",
    bgColor: "bg-green-400", 
    icon: "fa-bed",
    question: "早上07:50赶早八，发现厚被子有股潮闷味，睡得背上痒痒的，又没空晒被子咋办？",
    options: [
      { text: "扛着被子冲向教室，边上课边晒", color: "bg-gray-100" },
      { text: "喷植萃除螨喷雾，草本清香安心睡", color: "bg-green-100", isCorrect: true },
      { text: "假装没闻到，多喷点香水掩盖一下", color: "bg-yellow-100" }
    ],
    fact: "免洗速干，深入除螨，懒人必备"
  },
  {
    id: "pool-2",
    productName: "5层抽纸",
    bgColor: "bg-orange-400",
    icon: "fa-bowl-rice", 
    question: "中午在宿舍嗦螺蛳粉，红油汤汁溅得到处都是，普通纸一擦就烂漏满手油...",
    options: [
      { text: "直接用床单擦，反正也要洗（狠人）", color: "bg-red-100" },
      { text: "用5层加厚抽纸，吸油锁水不破漏", color: "bg-orange-100", isCorrect: true },
      { text: "试图用舌头舔干净，主打一个不浪费", color: "bg-blue-100" }
    ],
    fact: "5层加厚，湿水不破，一张抵两张"
  },
  {
    id: "pool-3",
    productName: "内衣皂",
    bgColor: "bg-pink-400",
    icon: "fa-hotel",
    question: "周末特种兵旅游住酒店，毛巾发硬香皂看着脏，想洗内衣又怕不卫生伤手...",
    options: [
      { text: "用酒店沐浴露凑合洗洗，心理安慰", color: "bg-blue-100" },
      { text: "带切好的内衣皂，抑菌护手一冲净", color: "bg-pink-100", isCorrect: true },
      { text: "不洗了，打包带回家这周再洗", color: "bg-red-100" }
    ],
    fact: "米萃温和，快速溶渍，护手更护衣"
  },
  {
    id: "pool-4",
    productName: "5层抽纸",
    bgColor: "bg-blue-400",
    icon: "fa-burger", 
    question: "晚上去小吃街扫荡，摊主的免费餐巾纸薄得像塑料，擦嘴还得花钱买手帕纸？",
    options: [
      { text: "用袖子擦嘴，主打一个潇洒不羁", color: "bg-gray-100" },
      { text: "出门带几张5层抽纸，一张搞定特省钱", color: "bg-blue-100", isCorrect: true },
      { text: "等风干，自然就是美", color: "bg-red-100" }
    ],
    fact: "亲肤无屑，擦泪不尴尬"
  },
  {
    id: "pool-5",
    productName: "内衣皂",
    bgColor: "bg-purple-400",
    icon: "fa-snowflake", 
    question: "冬天水太冷，手洗内衣冻得要死，随便搓两下又怕洗不干净滋生细菌...",
    options: [
      { text: "烧一壶开水烫内衣（面料全毁预警）", color: "bg-red-100" },
      { text: "用内衣皂，冷水速溶去渍不冻手", color: "bg-purple-100", isCorrect: true },
      { text: "用意念清洁法，相信它已经干净了", color: "bg-yellow-100" }
    ],
    fact: "母婴爱宠适用，温和除螨"
  }
];

class QuizApp {
  constructor() {
    this.currentIndex = 0;
    this.isAnswering = false;
    this.gameQuestions = []; // 当前一轮游戏的题目
  }

  // 洗牌算法
  shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  init() {
    // 1. 随机打乱题库
    const shuffledPool = this.shuffle([...FULL_QUESTION_POOL]);
    
    // 2. 筛选题目：确保不连续出现相同 productName
    const selectedQuestions = [];
    
    // 先放入第一题
    if (shuffledPool.length > 0) {
        selectedQuestions.push(shuffledPool.pop());
    }

    // 循环填充直到满3题
    while (selectedQuestions.length < 3 && shuffledPool.length > 0) {
        const lastQuestion = selectedQuestions[selectedQuestions.length - 1];
        
        // 在剩余池中寻找一个 productName 不同的题目
        const nextIndex = shuffledPool.findIndex(q => q.productName !== lastQuestion.productName);
        
        if (nextIndex !== -1) {
            // 找到了，取出并放入结果集
            selectedQuestions.push(shuffledPool[nextIndex]);
            shuffledPool.splice(nextIndex, 1);
        } else {
            // 没找到不同的（极端情况，理论上这组数据不会发生），只能取下一个
            selectedQuestions.push(shuffledPool.pop());
        }
    }

    this.gameQuestions = selectedQuestions;
    this.currentIndex = 0;
    
    this.renderQuestion();
  }

  start() {
    this.switchScreen('quiz-screen');
    this.init();
  }

  switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    const screen = document.getElementById(id);
    screen.style.opacity = '0';
    screen.animate([
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 400,
      easing: 'ease-out',
      fill: 'forwards'
    });
  }

  renderQuestion() {
    const q = this.gameQuestions[this.currentIndex];
    this.isAnswering = false;

    // 0. 更新背景色块 (UI 升级)
    // 提取颜色名称，例如 bg-green-400 -> green
    const colorName = q.bgColor.split('-')[1]; 
    const shape1 = document.getElementById('quiz-bg-shape-1');
    const shape2 = document.getElementById('quiz-bg-shape-2');
    
    // 应用较浅的同色系背景
    shape1.className = `geo-shape circle w-72 h-72 -top-20 -right-20 opacity-30 bg-${colorName}-200`;
    shape2.className = `geo-shape square w-56 h-56 bottom-10 -left-10 opacity-30 bg-${colorName}-300`;

    // 0.5 容器动画 (进入)
    const container = document.getElementById('quiz-content');
    container.classList.remove('slide-out');
    container.classList.add('slide-in');
    setTimeout(() => {
        container.classList.remove('slide-in');
    }, 400);

    // 1. 更新顶部点
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (i <= this.currentIndex + 1) {
            dot.style.opacity = '1';
            dot.classList.remove('bg-gray-300'); 
            dot.classList.add('bg-black');
        } else {
            dot.style.opacity = '0.2';
        }
    }
    document.getElementById('q-index').innerText = this.currentIndex + 1; // 显示 1, 2, 3

    // 2. 更新主视觉
    const visualContainer = document.getElementById('visual-container');
    visualContainer.className = visualContainer.className.replace(/bg-\w+-\d+/g, '');
    visualContainer.classList.add(q.bgColor);

    const iconEl = document.getElementById('question-icon');
    iconEl.className = `icon-draw fas ${q.icon} text-8xl text-white relative z-10 transform -rotate-6 transition-transform duration-500`;
    
    requestAnimationFrame(() => {
        iconEl.style.transform = 'scale(0.8) rotate(-12deg)';
        setTimeout(() => {
            iconEl.style.transform = 'scale(1) rotate(-6deg)';
        }, 50);
    });

    // 3. 更新文本
    document.getElementById('question-text').innerText = q.question;

    // 4. 生成色块选项（随机顺序）
    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    
    // 复制并打乱选项
    const shuffledOptions = this.shuffle([...q.options]);

    shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = `option-block ${opt.color} hover:opacity-90`;
      
      const letters = ['A', 'B', 'C'];
      const letterIcon = `<div class="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center font-bold mr-3 shrink-0">${letters[idx]}</div>`;
      
      btn.innerHTML = `
        ${letterIcon}
        <span class="font-bold text-lg leading-tight text-left flex-1">${opt.text}</span>
      `;
      // 传递完整的 opt 对象来判断正误
      btn.onclick = () => this.handleAnswer(opt, btn, q.bgColor); 
      grid.appendChild(btn);
    });
  }

  handleAnswer(selectedOption, btn, themeColorClass) {
    if (this.isAnswering) return;
    this.isAnswering = true;
    
    const isCorrect = selectedOption.isCorrect === true;
    const visualIcon = document.getElementById('question-icon');

    if (isCorrect) {
      // --- 剧烈正向反馈 ---
      btn.classList.add('correct'); 
      btn.innerHTML = `
        <i class="fas fa-check text-2xl mr-3 shrink-0"></i>
        <span class="font-bold text-lg">回答正确</span>
      `;
      
      // 图标弹跳
      visualIcon.classList.add('fa-bounce');
      
      // 手机震动 (如果支持)
      if (navigator.vibrate) navigator.vibrate(50);

      // 延迟转场
      setTimeout(() => {
        visualIcon.classList.remove('fa-bounce');
        
        if (this.currentIndex < this.gameQuestions.length - 1) {
          const container = document.getElementById('quiz-content');
          container.classList.add('slide-out');
          setTimeout(() => {
             this.currentIndex++;
             this.renderQuestion(); 
          }, 400); 
        } else {
          this.switchScreen('success-screen');
        }
      }, 1000); 

    } else {
      // --- 剧烈负向反馈 ---
      btn.classList.add('wrong');
      const originalContent = btn.innerHTML;
      btn.innerHTML = `
        <i class="fas fa-times text-2xl mr-3 shrink-0"></i>
        <span class="font-bold text-lg">回答错误</span>
      `;
      
      // 1. 图标晃动
      visualIcon.classList.add('fa-shake');
      
      // 2. 全屏剧烈震动
      document.body.classList.add('shake-hard');
      
      // 3. 手机震动
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      setTimeout(() => {
        visualIcon.classList.remove('fa-shake');
        document.body.classList.remove('shake-hard'); // 移除震动类
        
        btn.classList.remove('wrong');
        btn.innerHTML = originalContent;
        this.isAnswering = false;
      }, 800);
    }
  }
}

window.quizApp = new QuizApp();
