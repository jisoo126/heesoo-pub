// result.js

// 1) localStorage에서 저장된 데이터 불러오기
const peopleCount = parseInt(localStorage.getItem("peopleCount"), 10);
const orderList = JSON.parse(localStorage.getItem("orderList")) || [];
const selections = JSON.parse(localStorage.getItem("selections")) || [];

// 2) document 준비 후 결과 렌더링
window.addEventListener("DOMContentLoaded", () => {
  renderFinalResult();
});

/**
 * 전체 결과를 렌더링하는 함수
 * - 각 메뉴를 선택한 사람 수대로 가격을 나눠서 계산
 * - 각 사람마다 “선택한 항목, 분담 비용, 소계”를 보여줌
 */
function renderFinalResult() {
  const container = document.getElementById("result-container");
  container.innerHTML = ""; // 초기화

  // ① 각 메뉴별로 “선택한 사람 수”를 미리 계산
  //    예: { "item-1": 3, "item-2": 2, ... }
  const countPerItem = {};
  orderList.forEach((item) => {
    countPerItem[item.id] = 0;
  });
  // selections 배열을 순회하며 각 메뉴에 대해 체크 여부 카운트
  selections.forEach((personChoices) => {
    personChoices.forEach((choice) => {
      if (countPerItem[choice.id] !== undefined) {
        countPerItem[choice.id] += 1;
      }
    });
  });

  // ② 인원별로 섹션 생성
  let grandTotal = 0; // 전체 합계

  for (let i = 0; i < peopleCount; i++) {
    const personDiv = document.createElement("div");
    personDiv.className = "person-result";

    // “N번째 손님” 헤딩
    const heading = document.createElement("h2");
    heading.innerText = `👤 ${i + 1}번째 손님`;
    personDiv.appendChild(heading);

    // 이 사람이 선택한 항목이 없으면 안내 메시지
    if (!selections[i] || selections[i].length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.innerText = "선택하신 음식이 없습니다.";
      personDiv.appendChild(emptyMsg);
    } else {
      // ③ 각 항목별 분담금 계산 및 렌더링
      const ul = document.createElement("ul");
      let personSubtotal = 0; // 이 사람 소계

      // ③ 각 항목별 분담금 계산 및 렌더링 (수정 버전)
selections[i].forEach((choice) => {
  const itemId   = choice.id;
  const itemName = choice.name;
  const unitPrice= choice.price;

  // 이 메뉴를 선택한 사람 수
  const countSelected = countPerItem[itemId] || 1;

  // 원 주문 목록에서 실제 주문된 수량(qty) 가져오기
  const originalItem = orderList.find(item => item.id === itemId);
  const totalQty     = originalItem ? originalItem.qty : 1;

  // 전체 가격 = 단가 × 주문 수량
  const totalPrice = unitPrice * totalQty;

  // 1인당 분담금 = 전체 가격 ÷ 선택 인원
  const rawSplit = totalPrice / countSelected;
  const splitPriceFixed = Math.round(rawSplit); // 반올림

  personSubtotal += splitPriceFixed;
  grandTotal    += splitPriceFixed;

  const li = document.createElement("li");
  li.innerText = `${itemName} ×${totalQty}개 × ₩${unitPrice.toLocaleString()} ÷ ${countSelected}명 = ₩${splitPriceFixed.toLocaleString()}`;
  ul.appendChild(li);
});

      personDiv.appendChild(ul);

      // ④ 이 사람 소계 표시
      const subTotalDiv = document.createElement("div");
      subTotalDiv.className = "person-subtotal";
      subTotalDiv.innerHTML = `<strong>소계: ₩${personSubtotal.toLocaleString()}</strong>`;
      personDiv.appendChild(subTotalDiv);
    }

    container.appendChild(personDiv);
  }

  // ⑤ 전체 합계 표시
  const totalDiv = document.createElement("div");
  totalDiv.className = "grand-total";
  totalDiv.innerHTML = `<h2>🧾 전체 합계: ₩${grandTotal.toLocaleString()}</h2>`;
  container.appendChild(totalDiv);
}

// ⑥ “처음으로 돌아가기” 버튼 클릭 시
document.getElementById("restart").addEventListener("click", () => {
  // localStorage 정리(Optional)
  localStorage.removeItem("peopleCount");
  localStorage.removeItem("orderList");
  localStorage.removeItem("selections");

  // index.html로 이동
  window.location.href = "index.html";
});
