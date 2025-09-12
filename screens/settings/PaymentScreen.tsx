import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";

export default function PaymentScreen() {
  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"; // 테스트용
  const customerKey = "customer_1234"; // 사용자 구분용 unique key
  const orderId = "order_" + new Date().getTime();

  // 주문 정보 (프론트에서 만들지만 실제 결제 승인은 서버에서 처리해야 안전함)
  const paymentRequest = {
    amount: 50000,
    orderId: orderId,
    orderName: "테스트 상품",
    customerName: "홍길동",
    successUrl: "https://your-server.com/payments/success",
    failUrl: "https://your-server.com/payments/fail",
  };

  // WebView에 주입할 HTML (TossPayments JS SDK 사용)
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>TossPayments 결제</title>
      <script src="https://js.tosspayments.com/v1/payment-widget"></script>
    </head>
    <body>
      <div id="payment-method"></div>
      <div id="agreement"></div>
      <button id="pay-button">결제하기</button>

      <script>
        const clientKey = "${clientKey}";
        const customerKey = "${customerKey}";

        const paymentWidget = PaymentWidget(clientKey, customerKey);

        // 결제수단 & 약관 위젯 렌더링
        paymentWidget.renderPaymentMethods("#payment-method", { value: ${paymentRequest.amount} });
        paymentWidget.renderAgreement("#agreement");

        document.getElementById("pay-button").addEventListener("click", async () => {
          try {
            const result = await paymentWidget.requestPayment({
              orderId: "${paymentRequest.orderId}",
              orderName: "${paymentRequest.orderName}",
              customerName: "${paymentRequest.customerName}",
              successUrl: "${paymentRequest.successUrl}",
              failUrl: "${paymentRequest.failUrl}"
            });
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "success", result }));
          } catch (error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "fail", error }));
          }
        });
      </script>
    </body>
    </html>
  `;

  // RN <-> WebView 통신
  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "success") {
        Alert.alert("결제 성공", JSON.stringify(data.result));
      } else if (data.type === "fail") {
        Alert.alert("결제 실패", JSON.stringify(data.error));
      }
    } catch (err) {
      console.error("WebView message parsing error", err);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});