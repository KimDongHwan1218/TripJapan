import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Node 18 이전 버전만 필요
import dotenv from 'dotenv';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';

const app = express();
app.use(cors()); // 모든 도메인에서 접근 허용
app.use(express.json()); // JSON 파싱
const PORT = 3000;

app.use('/uploads', express.static('uploads'));
dotenv.config(); // .env 파일 로딩

const Cloud_Translation_API_KEY = process.env.Cloud_Translation_API_KEY;
const Cloud_SpeechtoText_API_KEY = process.env.Cloud_SpeechtoText_API_KEY;
const Cloud_Vision_API_KEY = process.env.Cloud_Vision_API_KEY;
const Travel_Payout_API_KEY=process.env.Travel_Payout_API_KEY;
const Travel_Payout_ID=process.env.Travel_Payout_ID


// 날짜 계산: 오늘 ~ 한 달 뒤
const today = new Date();
const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);
const formatDate = (d) => d.toISOString().split("T")[0];



console.log(Cloud_Translation_API_KEY)
const upload = multer({ dest: 'uploads/' });


// Mock data
const users = [
  { id: 1, username: 'testuser', email: 'test@example.com' }
];

const trips = [
  { id: 1, userId: 1, title: '홋카이도 여행', start_date: '2025-07-01', end_date: '2025-07-04' }
];

const TripData = {
  1: [
    { plan_id: 1, date: '2025-07-01', time: '10:00', place: '삿포로 시계탑', note: '사진 찍기' },
    { plan_id: 3, date: '2025-07-03', time: '10:00', place: 'sssssss', note: '사진 찍기' },
    { plan_id: 4, date: '2025-07-04', time: '10:00', place: 'tttttttt', note: '사진 찍기' },
  ]
};

const bookings = [
  { id: 1, tripId: 1, type: 'flight', details: '항공편 예약됨' }
];

// Auth
app.post('/auth/signup', (req, res) => {
  res.json({ message: '회원가입 성공', user: req.body });
});

app.post('/auth/login', (req, res) => {
  res.json({ message: '로그인 성공', token: 'fake-jwt-token' });
});

app.post('/auth/logout', (req, res) => {
  res.json({ message: '로그아웃 성공' });
});

// User
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  res.json(user);
});

app.patch('/users/:id', (req, res) => {
  res.json({ message: '사용자 정보 수정됨', updates: req.body });
});

// Trips
app.get('/trips', (req, res) => {
  res.json(trips);
});

app.post('/trips', (req, res) => {
  const newTrip = { id: trips.length + 1, ...req.body };
  trips.push(newTrip);
  res.status(201).json(newTrip);
});

app.get('/trips/:id', (req, res) => {
  const trip = trips.find(t => t.id === Number(req.params.id));
  res.json(trip);
});

app.patch('/trips/:id', (req, res) => {
  res.json({ message: '여행 정보 수정됨', updates: req.body });
});

app.delete('/trips/:id', (req, res) => {
  res.json({ message: '여행 삭제됨' });
});

app.get('/trips/:id/items', (req, res) => {
  res.json(TripData[req.params.id] || []);
});

app.post('/trips/:id/items', (req, res) => {
  const item = { itemid: Date.now(), ...req.body };
  const tripId = req.params.id;
  if (!TripData[tripId]) TripData[tripId] = [];
  TripData[tripId].push(item);
  res.status(201).json(item);
});

app.patch('/trips/:id/items/:itemid', (req, res) => {
  res.json({ message: '일정 수정됨', updates: req.body });
});

app.delete('/trips/:id/items/:itemid', (req, res) => {
  res.json({ message: '일정 삭제됨' });
});

// Bookings
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/bookings', (req, res) => {
  const booking = { id: bookings.length + 1, ...req.body };
  bookings.push(booking);
  res.status(201).json(booking);
});

app.get('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === Number(req.params.id));
  res.json(booking);
});

app.delete('/bookings/:id', (req, res) => {
  res.json({ message: '예약 삭제됨' });
});

app.post('/translate', async (req, res) => {
  const { text, q, source, target } = req.body;
  const input = text || q;  // 클라이언트에서 어떤 이름으로 보내든 OK

  if (!input || !target) {
    return res.status(400).json({ error: 'text(or q), target은 필수입니다.' });
  }

  try {
    const body = {
      q: input,   // ✅ text 대신 input 사용
      target,
    };
    if (source) body.source = source;

    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${Cloud_Translation_API_KEY}`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const translatedText = response.data?.data?.translations?.[0]?.translatedText;
    res.json({ translatedText });

  } catch (error) {
    console.error('번역 오류:', error.response?.data || error.message);
    res.status(500).json({ error: '번역 요청 실패', details: error.response?.data || error.message });
  }
});

// 1. 일본행 특가 항공권
app.get("/flights", async (req, res) => {
  try {
    const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=ICN&destination=NRT&departure_at=${formatDate(today)}&return_at=${formatDate(nextMonth)}&currency=KRW&token=${Travel_Payout_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();


    console.log(data)
    
    const flights = data.data
      .sort((a, b) => b.discount - a.discount) // 할인률 높은 순
      .slice(0, 5) // 상위 5개만
      .map(item => ({
        price: item.price,
        airline: item.airline,
        departure: item.departure_at,
        return: item.return_at,
        discount: item.discount,
        link: `https://www.aviasales.com/search/${item.origin}${item.destination}${item.departure_at.split("T")[0]}${Travel_Payout_ID}`
      }));

    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. 일본 특가 숙소 (Hotellook)
app.get("/hotels", async (req, res) => {
  try {
    // Hotellook API는 deprecated → 대신 Hotellook API 연결 기준
    const url = `https://engine.hotellook.com/api/v2/cache.json?location=Tokyo&currency=krw&checkIn=${formatDate(today)}&checkOut=${formatDate(nextMonth)}&limit=10&token=${Travel_Payout_API_KEY}&Travel_Payout_ID=${Travel_Payout_ID}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data)

    // 할인률 높은 순 정렬
    const hotels = data
      .sort((a, b) => (b.discount || 0) - (a.discount || 0)) // 예시: oldPrice 대비 할인율 계산
      .slice(0, 5) // 상위 5개만
      .map(hotel => ({
        name: hotel.hotelName,
        price: hotel.priceFrom,
        stars: hotel.stars,
        location: hotel.location,
        discount: hotel.discount,
        link: `https://search.hotellook.com/?Travel_Payout_ID=${Travel_Payout_ID}&hotelId=${hotel.hotelId}`
      }));

    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * 🗣️ 음성 인식 API
 * POST /speech-to-text
 * body: { audio: "BASE64_STRING" }
 */
app.post('/speech-to-text', async (req, res) => {
  const { audio, languageCode } = req.body;

  if (!audio || !languageCode) {
    return res.status(400).json({ error: 'audio, languageCode 모두 필요합니다.' });
  }

  try {
    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${Cloud_SpeechtoText_API_KEY}`,
      {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: languageCode,
        },
        audio: {
          content: audio,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('음성 인식 오류:', err.response?.data || err.message);
    res.status(500).json({ error: '음성 인식 실패' });
  }
});

app.post('/image-translate', upload.single('image'), async (req, res) => {
  const { source = 'ja', target = 'ko' } = req.body;
  const imagePath = req.file.path;

  try {
    // 1. 이미지 Base64 변환
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    // 2. Google Vision API로 OCR
    const visionRes = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${Cloud_Vision_API_KEY}`,
      {
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: 'TEXT_DETECTION' }]
          }
        ]
      }
    );

    const annotations = visionRes.data.responses[0]?.textAnnotations || [];
    if (annotations.length === 0) {
      return res.status(400).json({ error: '이미지에서 텍스트를 찾지 못했습니다.' });
    }

    

    // 3. 전체 텍스트 번역
    const detectedText = annotations[0].description; // 전체 텍스트
    const translateRes = await axios.post(`http://localhost:${PORT}/translate`, {
      text: detectedText,
      source,
      target
    });
    const translatedText = translateRes.data.translatedText;

    // 4. 텍스트 블록별로 위치 매핑
    const svgTexts = annotations.slice(1).map(a => {
      const vertices = a.boundingPoly.vertices;
      // 좌표 계산 (왼쪽 위 기준)
      const x = vertices[0].x || 0;
      const y = vertices[0].y || 0;
      return `<text x="${x}" y="${y}" font-size="24" fill="black">${translatedText}</text>`;
    }).join('');

    // 5. 원본 이미지 크기 얻기
    const metadata = await sharp(imagePath).metadata();
    const svgImage = `
      <svg width="${metadata.width}" height="${metadata.height}">
        ${svgTexts}
      </svg>
    `;

    // 6. 이미지 합성
    const editedImagePath = `uploads/translated-${Date.now()}.png`;
    await sharp(imagePath)
      .composite([{ input: Buffer.from(svgImage), top: 0, left: 0 }])
      .png()
      .toFile(editedImagePath);

    // 7. 결과 전송
    res.json({
      originalText: detectedText,
      translatedText,
      imageUrl: `http://192.168.35.53:${PORT}/uploads/${editedImagePath.split('/').pop()}`
    });

  } catch (error) {
    console.error('이미지 번역 오류:', error.response?.data || error.message);
    res.status(500).json({ error: '이미지 번역 실패', details: error.message });
  } finally {
    fs.unlinkSync(imagePath); // 임시 파일 삭제
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Mock API 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📱 스마트폰에서 접속하려면: http://<PC-IP>:${PORT}`);
});