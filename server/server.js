import express from 'express';

const app = express();
app.use(express.json());
const PORT = 3000;

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
    // { plan_id: 2, date: '2025-07-02', time: '10:00', place: '삿포로 시계탑', note: '사진 찍기' },
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
  console.log(trip)
});

app.patch('/trips/:id', (req, res) => {
  res.json({ message: '여행 정보 수정됨', updates: req.body });
});

app.delete('/trips/:id', (req, res) => {
  res.json({ message: '여행 삭제됨' });
});

app.get('/trips/:id/items', (req, res) => {
  console.log(TripData[req.params.id])
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


// Start Server
app.listen(PORT, () => {
  console.log(`Mock API 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
