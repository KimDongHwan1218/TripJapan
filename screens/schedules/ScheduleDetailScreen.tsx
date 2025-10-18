import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { ScheduleStackParamList } from '../../navigation/ScheduleStackNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ScheduleDetailScreenRouteProp = RouteProp<
  ScheduleStackParamList,
  'ScheduleDetailScreen'
>;

export default function ScheduleDetailScreen() {
  const route = useRoute<ScheduleDetailScreenRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ScheduleStackParamList>>();

  // 넘어온 일정 데이터 (없으면 새 일정 추가 모드)
  const existingPlan = route.params?.plan;
  const date = route.params?.date;

  const [hour, setHour] = useState(existingPlan ? existingPlan.time.split(':')[0] : '10');
  const [minute, setMinute] = useState(existingPlan ? existingPlan.time.split(':')[1] : '00');
  const [title, setTitle] = useState(existingPlan?.title || '');
  const [detail, setDetail] = useState(existingPlan?.detail || '');
  const [placeQuery, setPlaceQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');

  // 더미 추천 장소 리스트 (실제로는 구글플레이스 API 연결)
  const dummyPlaces = ['삿포로 시계탑', '삿포로 돔', '오도리 공원', '스스키노'];

  const filteredPlaces = dummyPlaces.filter((p) =>
    p.includes(placeQuery)
  );

  const handleSave = () => {
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }
    const newPlan = {
      time: `${hour}:${minute}`,
      title,
      detail,
      place: selectedPlace || placeQuery,
    };
    console.log('저장:', { date, plan: newPlan });

    // 여기서 실제 저장 로직 추가 예정
    navigation.goBack();
  };

  const handleDelete = () => {
    console.log('삭제:', existingPlan);
    // 여기서 삭제 로직 추가 예정
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {existingPlan ? '일정 수정' : '새 일정 추가'}
      </Text>

      {/* 시간 선택 */}
      <View style={styles.row}>
        <Picker
          selectedValue={hour}
          style={styles.picker}
          onValueChange={(v) => setHour(v)}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <Picker.Item key={i} label={`${i}`} value={String(i).padStart(2, '0')} />
          ))}
        </Picker>
        <Text style={styles.timeSeparator}>:</Text>
        <Picker
          selectedValue={minute}
          style={styles.picker}
          onValueChange={(v) => setMinute(v)}
        >
          {['00', '15', '30', '45'].map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>
      </View>

      {/* 제목 */}
      <TextInput
        style={styles.input}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />

      {/* 세부사항 */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="세부사항"
        value={detail}
        onChangeText={setDetail}
        multiline
      />

      {/* 장소 입력 */}
      <TextInput
        style={styles.input}
        placeholder="장소 입력"
        value={placeQuery || selectedPlace}
        onChangeText={(text) => {
          setPlaceQuery(text);
          setSelectedPlace('');
        }}
      />

      {/* 자동완성 리스트 */}
      {placeQuery.length > 0 && (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setSelectedPlace(item);
                setPlaceQuery('');
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* 버튼 영역 */}
      <View style={styles.buttonRow}>
        {existingPlan && (
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  picker: { flex: 1 },
  timeSeparator: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  saveButton: { backgroundColor: '#007AFF' },
  deleteButton: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
