// ▼ 仮データ（明日差し替えOK）
const data = [
  { maker: "トヨタ", car: "プリウス", model: "ZVW30", year: "2010", grade: "S", engine: "2ZR", drive: "2WD", filter: "ABC-123", rakuten: "#", yahoo: "#" },
  { maker: "ホンダ", car: "N-BOX", model: "JF1", year: "2015", grade: "G", engine: "S07A", drive: "4WD", filter: "XYZ-999", rakuten: "#", yahoo: "#" }
];

// ▼ 車種ごとの必要項目（仮）
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
    document.getElementById(id).style.display = "none";
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
    if (!document.getElementById(key).value) {
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

  let filtered = data.filter(i =>
    i.maker === makerVal &&
    i.car === carVal &&
    i.model === modelVal
  );

  const rule = carRules[carVal] || { required: [] };
  rule.required.forEach(key => {
    const val = document.getElementById(key).value;
    filtered = filtered.filter(i => i[key] === val);
  });

  const result = document.getElementById("result");

  if (filtered.length === 0) {
    result.textContent = "該当データがありません。";
    return;
  }

  const hit = filtered[0];
  result.innerHTML = `
    <p>適合フィルター品番：<strong>${hit.filter}</strong></p>
    <a href="${hit.rakuten}">楽天で見る</a>
    <a href="${hit.yahoo}">Yahooで見る</a>
  `;
}
