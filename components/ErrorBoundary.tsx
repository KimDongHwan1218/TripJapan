import { Component, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/styles";
import EmptyState from "./ui/EmptyState";

type Props = { children: ReactNode };
type State = { hasError: boolean };

// 화면 렌더링 중 예외가 나도 앱 전체가 크래시하는 대신 복구 UI를 보여준다.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("ErrorBoundary caught an error", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <EmptyState
            icon="warning-outline"
            title="문제가 발생했습니다"
            description="일시적인 오류일 수 있어요. 다시 시도해주세요."
            actionLabel="다시 시도"
            onAction={this.handleRetry}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
