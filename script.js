// ▼ 仮データ（明日会社で聞いたらここだけ差し替えればOK）
const data = [
  { maker: "トヨタ", car: "プリウス", model: "ZVW30", year: "2010", grade: "S", engine: "2ZR", drive: "2WD", filter: "ABC-123", rakuten: "#", yahoo: "#" },
  { maker: "トヨタ", car: "プリウス", model: "ZVW30", year: "2012", grade: "G", engine: "2ZR", drive: "2WD", filter: "ABC-123", rakuten: "#", yahoo: "#" },
  { maker: "ホンダ", car: "N-BOX", model: "JF1", year: "2015", grade: "G", engine: "S07A", drive: "4WD", filter: "XYZ-999", rakuten: "#", yahoo: "#" }
];

// ▼ 車種ごとの「必要な質問項目」ルール（仮）
const carRules = {
  "プリウス": { required: ["model", "year"] },
  "N-BOX": { required: ["model", "year", "grade"] },
  "ハリアー": { required: ["model", "engine", "drive"] }
};

// ▼ メーカー一覧を作成
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

// ▼ メーカー選択 → 車名更新
function updateCarNames() {
  const maker = document.getElementById("maker").value;
  const carSelect = document.getElementById("carName");
  carSelect.innerHTML = '<option value="">選択してください</option>';

  const cars = [...new Set(
    data.filter(item => item.maker === maker).map(item => item.car)
  )];

  cars.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    carSelect.appendChild(option);
  });

  document.getElementById("model").innerHTML = '<option value="">選択してください</option>';
  hideAllDynamicFields();
}

// ▼ 車名選択 → 型式更新
function updateModels() {
  const maker = document.getElementById("maker").value;
  const car = document.getElementById("carName").value;
  const modelSelect = document.getElementById("model");
  modelSelect.innerHTML = '<option value="">選択してください</option>';

  const models = [...new Set(
    data.filter(item => item.maker === maker && item.car === car).map(item => item.model)
  )];

  models.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    modelSelect.appendChild(option);
  });

  hideAllDynamicFields();
}

// ▼ 型式選択 → 必要な質問項目だけ表示
function updateDynamicQuestions() {
  hideAllDynamicFields();

  const car = document.getElementById("carName").value;
  const rule = carRules[car] || { required: [] };

  rule.required.forEach(key => {
    const fieldId = key + "Field";
    const field = document.getElementById(fieldId);
    if (field) field.style.display = "block";

    // ▼ 選択肢を自動生成
    const select = document.getElementById(key);
    if (select) {
      const maker = document.getElementById("maker").value;
      const model = document.getElementById("model").value;

      const values = [...new Set(
        data
          .filter(item => item.maker === maker && item.car === car && item.model === model)
          .map(item => item[key])
      )];

      select.innerHTML = "";
      values.forEach(v => {
        const option = document.createElement("option");
        option.value = v;
        option.textContent = v;
        select.appendChild(option);
      });
    }
  });
}

// ▼ 全ての追加項目を非表示
function hideAllDynamicFields() {
  ["yearField", "gradeField", "engineField", "driveField"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
}

// ▼ 検索
function searchFilter() {
  const maker = document.getElementById("maker").value;
  const car = document.getElementById("carName").value;
  const model = document.getElementById("model").value;

  let filtered = data.filter(item =>
    item.maker === maker &&
    item.car === car &&
    item.model === model
  );

  const rule = carRules[car] || { required: [] };

  rule.required.forEach(key => {
    const value = document.getElementById(key).value;
    filtered = filtered.filter(item => item[key] === value);
  });

  const result = document.getElementById("result");

  if (filtered.length > 0) {
    const hit = filtered[0];
    result.innerHTML = `
      <p>適合フィルター品番：<strong>${hit.filter}</strong></p>
      <a href="${hit.rakuten}">楽天で見る</a>
      <a href="${hit.yahoo}">Yahooで見る</a>
    `;
  } else {
    result.textContent = "該当データがありません。";
  }
}
