import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

import styles from "@/widgets/care-detail/ui/CareDetailPage.module.css";

type CareKakaoMapProps = {
  latitude?: number;
  longitude?: number;
  name: string;
  address: string;
};

const appkey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? "";

export function CareKakaoMap({
  latitude,
  longitude,
  name,
  address,
}: CareKakaoMapProps) {
  if (
    !appkey ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return <MapFallback name={name} address={address} />;
  }

  return (
    <LoadedKakaoMap
      latitude={latitude}
      longitude={longitude}
      name={name}
      address={address}
    />
  );
}

function LoadedKakaoMap({
  latitude,
  longitude,
  name,
  address,
}: Required<CareKakaoMapProps>) {
  const [loading, error] = useKakaoLoader({ appkey });

  if (loading) {
    return <MapFallback name={name} address="지도를 불러오는 중입니다." />;
  }

  if (error) {
    return <MapFallback name={name} address={address} />;
  }

  return (
    <Map
      center={{ lat: latitude, lng: longitude }}
      level={3}
      className={styles.kakaoMap}
    >
      <MapMarker position={{ lat: latitude, lng: longitude }} title={name} />
    </Map>
  );
}

function MapFallback({
  name,
  address,
}: Pick<CareKakaoMapProps, "name" | "address">) {
  return (
    <div className={styles.mapFallback}>
      <span>{name}</span>
      <strong>{address}</strong>
    </div>
  );
}
