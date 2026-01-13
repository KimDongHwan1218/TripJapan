export type TripCity =
  | "Tokyo"
  | "Yokohama"
  | "Hakone"
  | "Osaka"
  | "Kyoto"
  | "Kobe"
  | "Nara"
  | "Nagoya"
  | "Takayama"
  | "Sapporo"
  | "Otaru"
  | "Fukuoka"
  | "Beppu"
  | "Yufuin"
  | "Okinawa";
  // 도시 하나에 대한 모든 메타 정보
export type CityMeta = {
  key: TripCity;

  label: {
    ko: string;
    en: string;
    ja: string;
  };

  image: any; // require() 결과, RN ImageSource

  // 지도 기본 중심
  center: {
    lat: number;
    lng: number;
  };

  // 지도 줌 기본값 (선택)
  region: {
    latDelta: number;
    lngDelta: number;
  };
};

export const CITY_META: Record<TripCity, CityMeta> = {
  Tokyo: {
    key: "Tokyo",
    label: {
      ko: "도쿄",
      en: "Tokyo",
      ja: "東京",
    },
    image: require("@/assets/cities/tokyo.jpg"),
    center: { lat: 35.681236, lng: 139.767125 },
    region: { latDelta: 0.08, lngDelta: 0.08 },
  },

  Yokohama: {
    key: "Yokohama",
    label: {
      ko: "요코하마",
      en: "Yokohama",
      ja: "横浜",
    },
    image: require("@/assets/cities/yokohama.jpg"),
    center: { lat: 35.443707, lng: 139.638031 },
    region: { latDelta: 0.08, lngDelta: 0.08 },
  },

  Hakone: {
    key: "Hakone",
    label: {
      ko: "하코네",
      en: "Hakone",
      ja: "箱根",
    },
    image: require("@/assets/cities/hakone.jpg"),
    center: { lat: 35.2323, lng: 139.1069 },
    region: { latDelta: 0.12, lngDelta: 0.12 },
  },

  Osaka: {
    key: "Osaka",
    label: {
      ko: "오사카",
      en: "Osaka",
      ja: "大阪",
    },
    image: require("@/assets/cities/osaka.jpg"),
    center: { lat: 34.6937, lng: 135.5023 },
    region: { latDelta: 0.08, lngDelta: 0.08 },
  },

  Kyoto: {
    key: "Kyoto",
    label: {
      ko: "교토",
      en: "Kyoto",
      ja: "京都",
    },
    image: require("@/assets/cities/kyoto.jpg"),
    center: { lat: 35.0116, lng: 135.7681 },
    region: { latDelta: 0.07, lngDelta: 0.07 },
  },

  Kobe: {
    key: "Kobe",
    label: {
      ko: "고베",
      en: "Kobe",
      ja: "神戸",
    },
    image: require("@/assets/cities/kobe.jpg"),
    center: { lat: 34.6901, lng: 135.1955 },
    region: { latDelta: 0.08, lngDelta: 0.08 },
  },

  Nara: {
    key: "Nara",
    label: {
      ko: "나라",
      en: "Nara",
      ja: "奈良",
    },
    image: require("@/assets/cities/nara.jpg"),
    center: { lat: 34.6851, lng: 135.8048 },
    region: { latDelta: 0.06, lngDelta: 0.06 },
  },

  Nagoya: {
    key: "Nagoya",
    label: {
      ko: "나고야",
      en: "Nagoya",
      ja: "名古屋",
    },
    image: require("@/assets/cities/nagoya.jpg"),
    center: { lat: 35.1815, lng: 136.9066 },
    region: { latDelta: 0.08, lngDelta: 0.08 },
  },

  Takayama: {
    key: "Takayama",
    label: {
      ko: "다카야마",
      en: "Takayama",
      ja: "高山",
    },
    image: require("@/assets/cities/takayama.jpg"),
    center: { lat: 36.1461, lng: 137.251 },
    region: { latDelta: 0.1, lngDelta: 0.1 },
  },

  Sapporo: {
    key: "Sapporo",
    label: {
      ko: "삿포로",
      en: "Sapporo",
      ja: "札幌",
    },
    image: require("@/assets/cities/sapporo.jpg"),
    center: { lat: 43.0618, lng: 141.3545 },
    region: { latDelta: 0.1, lngDelta: 0.1 },
  },

  Otaru: {
    key: "Otaru",
    label: {
      ko: "오타루",
      en: "Otaru",
      ja: "小樽",
    },
    image: require("@/assets/cities/otaru.jpg"),
    center: { lat: 43.1907, lng: 140.9947 },
    region: { latDelta: 0.08, lngDelta: 0.08 },
  },

  Fukuoka: {
    key: "Fukuoka",
    label: {
      ko: "후쿠오카",
      en: "Fukuoka",
      ja: "福岡",
    },
    image: require("@/assets/cities/fukuoka.jpg"),
    center: { lat: 33.5902, lng: 130.4017 },
    region: { latDelta: 0.08, lngDelta: 0.08 },
  },

  Beppu: {
    key: "Beppu",
    label: {
      ko: "벳푸",
      en: "Beppu",
      ja: "別府",
    },
    image: require("@/assets/cities/beppu.jpg"),
    center: { lat: 33.2794, lng: 131.497 },
    region: { latDelta: 0.1, lngDelta: 0.1 },
  },

  Yufuin: {
    key: "Yufuin",
    label: {
      ko: "유후인",
      en: "Yufuin",
      ja: "湯布院",
    },
    image: require("@/assets/cities/yufuin.jpg"),
    center: { lat: 33.2584, lng: 131.308 },
    region: { latDelta: 0.08, lngDelta: 0.08 },
  },

  Okinawa: {
    key: "Okinawa",
    label: {
      ko: "오키나와",
      en: "Okinawa",
      ja: "那覇",
    },
    image: require("@/assets/cities/okinawa.jpg"),
    center: { lat: 26.2124, lng: 127.6809 },
    region: { latDelta: 0.12, lngDelta: 0.12 },
  },
};