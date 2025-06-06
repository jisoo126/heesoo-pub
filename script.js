// script.js

// 각 메뉴의 가격을 객체에 정의 (index.html의 ID와 가격을 맞춥니다)
const prices = {
    "item-1": 9000,  // 치즈라볶이
    "item-2": 8000,  // 짜빠구리
    "item-3": 8000,  // 갈릭포테이토
    "item-4": 5000,  // 살얼음파인애플
    "item-5": 5000,  // 소주
    "item-6": 5000,   // 맥주 
    "item-7": 2000,   // 콜라
    "item-8": 2000,   // 사이다
  };
  
  // 총합을 화면에 표시하는 함수
  function updateTotal() {
    let total = 0;
    document.querySelectorAll(".qty").forEach(input => {
      const id = input.id;
      const qty = parseInt(input.value, 10) || 0;
      total += qty * prices[id];
    });
    document.getElementById("total-price").innerText = total.toLocaleString();
  }
  
  // 페이지 로드 후: 수량 입력(input.qty) 요소에 이벤트 리스너 붙이고 총합 초기화
  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".qty").forEach(input => {
      input.addEventListener("input", updateTotal);
    });
    updateTotal();
  });
  
  // “다음” 버튼 클릭 시 실행되는 함수
  document.getElementById("to-confirm").addEventListener("click", () => {
    const peopleCountInput = document.getElementById("people-count");
    const peopleCount = parseInt(peopleCountInput.value, 10);
  
    // 인원 수 입력 검증
    if (!peopleCount || peopleCount < 1) {
      alert("인원 수를 1명 이상 입력해 주세요.");
      peopleCountInput.focus();
      return;
    }
  
    // 선택된 메뉴 목록(orderList) 구성
    const orderList = [];
    document.querySelectorAll(".qty").forEach(input => {
      const qty = parseInt(input.value, 10) || 0;
      if (qty > 0) {
        // 메뉴 이름을 가져오기 위해 이전 형제 요소(span)의 텍스트 사용
        // 구조: <span>메뉴명</span><span>₩가격</span><input class="qty" id="item-x" ...>
        const menuName = input.previousElementSibling.previousElementSibling.innerText;
        orderList.push({
          id: input.id,
          name: menuName,
          qty: qty,
          price: prices[input.id]
        });
      }
    });
  
    if (orderList.length === 0) {
      alert("하나 이상의 메뉴를 선택해 주세요.");
      return;
    }
  
    // localStorage에 저장
    localStorage.setItem("peopleCount", peopleCount);
    localStorage.setItem("orderList", JSON.stringify(orderList));
  
    // 다음 페이지(checkout.html)로 이동
    window.location.href = "checkout.html";
  });
  
  