// ▼ 仮データ（明日会社で正式データに差し替え）
const data = [
  {
    maker: "トヨタ",
    car: "プリウス",
    model: "ZVW30",
    year: "2010",
    grade: "S",
    engine: "2ZR",
    drive: "2WD",
    products: [
      { code: "A123", label: "自社 高性能タイプ", type: "A", priority: 1 },
      { code: "A124", label: "自社 標準タイプ", type: "A", priority: 2 },
      { code: "B555", label: "他社 標準タイプ", type: "B", priority: 3 }
    ]
  },
  {
    maker: "ホンダ",
    car: "N-BOX",
    model: "JF1",
    year: "2015",
    grade: "G",
    engine: "S07A",
    drive: "4WD",
    products: [
      { code: "B999", label: "他社 標準タイプ", type: "B", priority: 2 },
      { code: "C777", label: "他社 廉価タイプ", type: "C", priority: 3 }
    ]
  }
];

// ▼ 車種ごとの必要項目（仮）
// ※ ここは明日会社で聞いた内容に合わせて書き換えればOK
const carRules = {
  "プリウス": { required: ["year"] },
  "N-BOX": { required: ["year", "grade"] }
};

// ▼ メーカー一覧
window.onload = function() {
  const makerSelect = document.getElementById("maker");
  const makers = [...new Set(data.map(item => item.maker))];

  makers.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    makerSelect.appendChild(option);
  });
};

// ▼ メーカー → 車名
function updateCarNames() {
  const makerVal = document.getElementById("maker").value;
  const carSelect = document.getElementById("carName");

  carSelect.innerHTML = '<option value="">選択してください</option>';

  const cars = [...new Set(
    data.filter(i => i.maker === makerVal).map(i => i.car)
  )];

  cars.forEach(c => {
    const op = document.createElement("option");
    op.value = c;
    op.textContent = c;
    carSelect.appendChild(op);
  });

  document.getElementById("model").innerHTML = '<option value="">選択してください</option>';
  hideAllDynamicFields();
  validateForm();
}

// ▼ 車名 → 型式
function updateModels() {
  const makerVal = document.getElementById("maker").value;
  const carVal = document.getElementById("carName").value;
  const modelSelect = document.getElementById("model");

  modelSelect.innerHTML = '<option value="">選択してください</option>';

  const models = [...new Set(
    data.filter(i => i.maker === makerVal && i.car === carVal).map(i => i.model)
  )];

  models.forEach(m => {
    const op = document.createElement("option");
    op.value = m;
    op.textContent = m;
    modelSelect.appendChild(op);
  });

  hideAllDynamicFields();
  validateForm();
}

// ▼ 型式 → 必要項目だけ表示
function updateDynamicQuestions() {
  hideAllDynamicFields();

  const carVal = document.getElementById("carName").value;
  const rule = carRules[carVal] || { required: [] };

  rule.required.forEach(key => {
    const field = document.getElementById(key + "Field");
    if (field) field.style.display = "block";

    const select = document.getElementById(key);
    if (!select) return;

    const makerVal = document.getElementById("maker").value;
    const modelVal = document.getElementById("model").value;

    const values = [...new Set(
      data.filter(i =>
        i.maker === makerVal &&
        i.car === carVal &&
        i.model === modelVal
      ).map(i => i[key])
    )];

    select.innerHTML = '<option value="">選択してください</option>';
    values.forEach(v => {
      const op = document.createElement("option");
      op.value = v;
      op.textContent = v;
      select.appendChild(op);
    });
  });

  validateForm();
}

// ▼ 全項目非表示
function hideAllDynamicFields() {
  ["yearField", "gradeField", "engineField", "driveField"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.style.display = "none";
  });
}

// ▼ 入力チェック
function validateForm() {
  const makerVal = document.getElementById("maker").value;
  const carVal = document.getElementById("carName").value;
  const modelVal = document.getElementById("model").value;

  const rule = carRules[carVal] || { required: [] };

  if (!makerVal || !carVal || !modelVal) {
    disableSearch("すべて選択してください");
    return;
  }

  for (const key of rule.required) {
    const field = document.getElementById(key);
    if (!field || !field.value) {
      disableSearch("すべて選択してください");
      return;
    }
  }

  enableSearch();
}

function disableSearch(msg) {
  const btn = document.getElementById("searchBtn");
  btn.disabled = true;
  document.getElementById("errorMsg").textContent = msg;
}

function enableSearch() {
  const btn = document.getElementById("searchBtn");
  btn.disabled = false;
  document.getElementById("errorMsg").textContent = "";
}

// ▼ 検索
function searchFilter() {
  validateForm();
  if (document.getElementById("searchBtn").disabled) return;

  const makerVal = document.getElementById("maker").value;
  const carVal = document.getElementById("carName").value;
  const modelVal = document.getElementById("model").value;
  const yearVal = document.getElementById("year")?.value || null;
  const gradeVal = document.getElementById("grade")?.value || null;
  const engineVal = document.getElementById("engine")?.value || null;
  const driveVal = document.getElementById("drive")?.value || null;

  // まず車両条件で1件に絞る（実務ではここが1行になる想定）
  let filtered = data.filter(i =>
    i.maker === makerVal &&
    i.car === carVal &&
    i.model === modelVal &&
    (yearVal ? i.year === yearVal : true) &&
    (gradeVal ? i.grade === gradeVal : true) &&
    (engineVal ? i.engine === engineVal : true) &&
    (driveVal ? i.drive === driveVal : true)
  );

  const result = document.getElementById("result");

  if (filtered.length === 0) {
    result.textContent = "該当データがありません。";
    return;
  }

  const hit = filtered[0];

  // ▼ 商品リストを優先順位順に並べ替え
  const products = [...(hit.products || [])].sort((a, b) => a.priority - b.priority);

  if (products.length === 0) {
    result.textContent = "該当データはありますが、商品情報が登録されていません。";
    return;
  }

  // ▼ A があれば A だけ表示、なければ全部表示
  const hasA = products.some(p => p.type === "A");
  const toShow = hasA ? products.filter(p => p.type === "A") : products;

  // ▼ 検索リンク生成
  const html = toShow.map(p => {
    const rakutenUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(p.code)}/`;
    const yahooUrl = `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(p.code)}`;
    return `
      <div class="product">
        <p>品番：<strong>${p.code}</strong>（${p.label}）</p>
        <a href="${rakutenUrl}" target="_blank">楽天で検索する</a>
        <a href="${yahooUrl}" target="_blank">Yahooで検索する</a>
      </div>
    `;
  }).join("");

  result.innerHTML = `
    <p>この車に適合するエアコンフィルター：</p>
    ${html}
  `;
}
